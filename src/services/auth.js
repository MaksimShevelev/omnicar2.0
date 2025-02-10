import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, editUserProfile, getUserProfileById } from "./user-profile";
import { getFileURL, uploadFile } from "./file-storage";
import { reactive } from "vue";

// Используем реактивный объект для хранения данных пользователя
let userData = reactive({
    id: null,
    email: null,
    displayName: null,
    rol: null,
    bio: null,
    photoURL: null,
    telefono: null,
    marca: null,
    modelo: null,
});

// Попытка загрузить данные пользователя из localStorage
if (localStorage.getItem('user')) {
    try {
        userData = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error('Invalid user data in localStorage', error);
        // В случае ошибки восстанавливаем значения по умолчанию
        userData = { id: null, email: null, displayName: null, rol: null, bio: null, photoURL: null,  telefono: null, marca: null, modelo: null};
    }
}

let observers = [];

// Отслеживание изменений состояния аутентификации
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Обновляем данные пользователя, если он аутентифицирован
        userData = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            telefono: user.telefono,
            marca: user.marca,
            modelo: user.modelo,
        };

        getUserProfileById(user.uid).then((profile) => {
            // Обновляем данные пользователя из профиля
            updateUserData({
                bio: profile.bio,
                rol: profile.rol,
            });

            notifyAll(); // Уведомляем всех подписчиков
        });
    } else {
        // Сброс данных, если пользователь не аутентифицирован
        updateUserData({
            id: null,
            email: null,
            displayName: null,
            rol: null,
            bio: null,
            photoURL: null,
            telefono: null,
            marca: null,
            modelo: null,
        });
        localStorage.removeItem('user');
    }
});

// Функция для входа
export async function login({ email, password }) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        console.error('[auth.js login] Error during login: ', error);
        throw error;
    }
}

// Функция для регистрации
export async function register({ email, password }) {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(credentials.user.uid, { email });
    } catch (error) {
        console.error('[auth.js register] Error during registration: ', error);
        throw error;
    }
}

// Функция для редактирования профиля
export async function editMyProfile({ displayName, rol, bio, telefono, email, marca, modelo }) {
    try {
        const promiseAuth = updateProfile(auth.currentUser, { displayName });
        const promiseProfile = editUserProfile(userData.id, { displayName, rol, bio, telefono, email, marca, modelo});
        await Promise.all([promiseAuth, promiseProfile]);

        // Обновляем данные после изменения
        updateUserData({
            displayName,
            rol,
            bio,
            telefono,
            email,
            marca,
            modelo,
        });
    } catch (error) {
        console.error('[auth.js editMyProfile] Error while editing profile: ', error);
        throw error;
    }
}

// Функция для редактирования фото профиля
export async function editMyProfilePhoto(photo) {
    try {
        const filepath = `users/${userData.id}/avatar.jpg`;
        await uploadFile(filepath, photo);
        const photoURL = await getFileURL(filepath);

        if (!photoURL) {
            throw new Error('Could not retrieve photo URL');
        }

        if (auth.currentUser) {
            const promiseAuth = updateProfile(auth.currentUser, { photoURL });

            const updateData = {
                displayName: userData.displayName || null,
                rol: userData.rol || null,
                bio: userData.bio || null,
                telefono: userData.telefono || null,
                photoURL,
                marca: userData.marca || null,
                modelo: userData.modelo || null,
            };

            const promiseFirestore = editUserProfile(userData.id, updateData);
            await Promise.all([promiseAuth, promiseFirestore]);

            updateUserData({
                photoURL,
            });
        } else {
            throw new Error('User is not authenticated');
        }
    } catch (error) {
        console.error('[auth.js editMyProfilePhoto] Error while editing profile photo: ', error);
        throw error;
    }
}

// Функция для выхода
export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('[auth.js logout] Error during logout: ', error);
        throw error;
    }
}

// Подписка на изменения состояния аутентификации
export function subscribeToAuthState(callback) {
    observers.push(callback);
    notify(callback);

    return () => {
        observers = observers.filter((obs) => obs !== callback);
    };
}

// Уведомление наблюдателей с обновленными данными
function notify(callback) {
    callback({ ...userData });
}

// Уведомление всех наблюдателей
function notifyAll() {
    observers.forEach((observer) => notify(observer));
}

// Обновление данных пользователя и сохранение в localStorage
function updateUserData(newData) {
    userData = {
        ...userData,
        ...newData,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    notifyAll();
}

// Экспортируем useAuth, чтобы получать доступ к данным пользователя
export function useAuth() {
    return { userData };
}
