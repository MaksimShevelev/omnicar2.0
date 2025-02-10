import { db } from "./firebase";  
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    serverTimestamp, 
    orderBy, 
    limit,
    updateDoc, 
    onSnapshot 
} from "firebase/firestore";
import { getUserProfileById } from "./user-profile";

// Кэш чатов
let chatsCache = {};  

/**
 * Получаем ключ для кэша на основе id пользователей.
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {string}
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join('_');
}

/**
 * Добавляем данные в кэш
 * @param {string} key 
 * @param {any} value 
 */
function cacheAdd(key, value) {
    chatsCache[key] = value;
}

/**
 * Получаем документ чата между пользователями.
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
async function getPrivateChatDocument(senderId, receiverId) {
    if (!senderId || !receiverId) {
        console.error("getPrivateChatDocument: Не указаны ID пользователей");
        return null;
    }

    const cacheKey = getCacheKey(senderId, receiverId);
    const cacheDoc = chatsCache[cacheKey];

    if (cacheDoc) return cacheDoc;

    const privateChatRef = collection(db, `private-chats`);
    const privateChatQuery = query(privateChatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }));

    const privateChatsSnapshot = await getDocs(privateChatQuery);
    let chatDocument;

    if (privateChatsSnapshot.empty) {
        chatDocument = await addDoc(privateChatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            },
        });
    } else {
        chatDocument = privateChatsSnapshot.docs[0];
    }

    cacheAdd(cacheKey, chatDocument);
    return chatDocument;
}

/**
 * Сохраняем сообщение в чате.
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {
    const privateChatDoc = await getPrivateChatDocument(senderId, receiverId);
    if (!privateChatDoc) return;

    const messagesRef = collection(db, `private-chats/${privateChatDoc.id}/messages`);
    const messageRef = await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });

    // Создаем уведомление для получателя
    await saveNotification(senderId, receiverId, messageRef.id, text);
}

/**
 * Сохраняем уведомление для получателя
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} messageId 
 * @param {string} text 
 */
export async function saveNotification(senderId, receiverId, messageId, text) {
    const notificationsRef = collection(db, 'notifications');
    
    // Если текст не передан (undefined), задаем дефолтное значение
    if (text === undefined) {
        text = '';  // Можно заменить на любое дефолтное сообщение
    }

    // Получаем уведомление для текущего получателя и отправителя
    const notificationsQuery = query(
        notificationsRef,
        where('sender_id', '==', senderId),
        where('receiver_id', '==', receiverId),
        where('read', '==', false)  // Если уведомление не прочитано
    );

    const notificationsSnapshot = await getDocs(notificationsQuery);

    if (notificationsSnapshot.empty) {
        // Если уведомления для этого отправителя нет — создаем новое
        await addDoc(notificationsRef, {
            chat_id: getCacheKey(senderId, receiverId),
            message_id: messageId,
            sender_id: senderId,
            receiver_id: receiverId,
            text,
            created_at: serverTimestamp(),
            read: false  // Уведомление по умолчанию не прочитано
        });
    } else {
        // Если уведомление для этого отправителя уже существует — обновляем его
        const existingNotification = notificationsSnapshot.docs[0];
        await updateDoc(existingNotification.ref, {
            message_id: messageId,
            text, // Обновляем текст уведомления
            created_at: serverTimestamp() // Обновляем время
        });
    }
}

/**
 * Подписка на новые сообщения в чате.
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {Function} callback 
 * @param {object} store 
 * @returns {Promise<import("firebase/firestore").Unsubscribe>}
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback, store) {
    const privateChatDoc = await getPrivateChatDocument(senderId, receiverId);
    if (!privateChatDoc) return;

    const messagesRef = collection(db, `private-chats/${privateChatDoc.id}/messages`);
    const messagesQuery = query(messagesRef, orderBy('created_at'));

    const unsubscribe = onSnapshot(messagesQuery, snapshot => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            user_id: doc.data().user_id,
            text: doc.data().text,
            created_at: doc.data().created_at?.toDate(),
        }));

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.user_id !== senderId) {
            store.dispatch('newMessageReceived');
        }

        callback(messages);
    });

    return unsubscribe;
}

/**
 * Получаем чаты пользователя.
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getUserPrivateChats(userId) {
    if (!userId) {
        console.error("getUserPrivateChats: Не указан ID пользователя");
        return [];
    }

    const privateChatsRef = collection(db, "private-chats");
    const q = query(privateChatsRef, where(`users.${userId}`, "==", true));

    const snapshot = await getDocs(q);

    const chats = await Promise.all(
        snapshot.docs.map(async doc => {
            const users = Object.keys(doc.data().users);
            const otherUserId = users.find(id => id !== userId);

            const messagesRef = collection(db, `private-chats/${doc.id}/messages`);
            const messagesQuery = query(messagesRef, orderBy('created_at', 'desc'), limit(1));
            const messagesSnapshot = await getDocs(messagesQuery);

            let lastMessage = 'Нет сообщений';
            let lastMessageTime = null;

            if (!messagesSnapshot.empty) {
                const lastMessageDoc = messagesSnapshot.docs[0];
                lastMessage = lastMessageDoc.data().text || 'Без текста';
                lastMessageTime = lastMessageDoc.data().created_at?.toDate() || null;
            }

            return { 
                chatId: doc.id, 
                otherUserId,
                lastMessage,
                lastMessageTime,
            };
        })
    );

    return chats;
}



/**
 * Получаем профили пользователей по их ID.
 * 
 * @param {Array<string>} userIds 
 * @returns {Promise<Array>} 
 */
export async function getUsersProfiles(userIds) {
    const profiles = await Promise.all(
        userIds.map(id => getUserProfileById(id))  // Используем getUserProfileById для получения профилей
    );
    return profiles.filter(profile => profile); // Возвращаем только валидные профили
}