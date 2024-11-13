import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Получает профиль пользователя по его ID.
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, displayName: string|null, rol: string|null, bio: string|null, photoURL: string|null} | null>}
 */
export async function getUserProfileById(id) {
    if (!id) {
        console.error("getUserProfileById: отсутствует ID пользователя");
        return null;
    }

    const userRef = doc(db, `users/${id}`);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        console.error(`User with ID ${id} does not exist.`);
        return null;
    }

    const data = userSnapshot.data();
    return {
        id: userSnapshot.id,
        email: data.email || null,
        displayName: data.displayName || null,
        rol: data.rol || null,
        bio: data.bio || null,
        photoURL: data.photoURL || null,
    };
}

/**
 * Создает профиль пользователя.
 * @param {string} id 
 * @param {{email: string}} data
 * @returns {Promise<void>}
 */
export async function createUserProfile(id, { email }) {
    if (!id || !email) {
        console.error("createUserProfile: неверные данные");
        return;
    }
    const userRef = doc(db, `users/${id}`);
    await setDoc(userRef, { email });
}

/**
 * Редактирует профиль пользователя.
 * @param {string} id 
 * @param {{displayName: string, bio: string, photoURL: string, rol: string}} data
 * @returns {Promise<void>}
 */
export async function editUserProfile(id, data) {
    if (!id || !data) {
        console.error("editUserProfile: неверные данные");
        return;
    }
    const userRef = doc(db, `users/${id}`);
    await updateDoc(userRef, data);
}
