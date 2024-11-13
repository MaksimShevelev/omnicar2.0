import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, editUserProfile, getUserProfileById } from "./user-profile";
import { getFileURL, uploadFile } from "./file-storage";

let userData = {
    id: null,
    email: null,
    displayName: null,
    rol: null,
    bio: null,
    photoURL: null,
}

if (localStorage.getItem('user')) {
    userData = JSON.parse(localStorage.getItem('user'));
}

let observers = [];

onAuthStateChanged(auth, user => {
    if (user) {
        userData = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }

        getUserProfileById(user.uid)
            .then(profile => {
                updateUserData({
                    bio: profile.bio,
                    rol: profile.rol,
                });

                notifyAll();
            });
    } else {
        updateUserData({
            id: null,
            email: null,
            displayName: null,
            rol: null,
            bio: null,
            photoURL: null,
        });
        localStorage.removeItem('user');
    }
});

export async function login({ email, password }) {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
}

export async function register({ email, password }) {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(credentials.user.uid, { email });
    } catch (error) {
        console.error('[auth.js register] Error al registrar el usuario: ', error);
        throw error;
    }
}

export async function editMyProfile({ displayName, rol, bio }) {
    try {
        const promiseAuth = updateProfile(auth.currentUser, { displayName });
        const promiseProfile = editUserProfile(userData.id, { displayName, rol, bio });
        await Promise.all([promiseAuth, promiseProfile]);

        updateUserData({
            displayName,
            rol,
            bio,
        });
    } catch (error) {
        console.error('[auth.js editMyProfile] Error al editar los datos del perfil: ', error);
        throw error;
    }
}

/**
 * 
 * @param {File} photo 
 */
export async function editMyProfilePhoto(photo) {
    try {
        const filepath = `users/${userData.id}/avatar.jpg`;
        await uploadFile(filepath, photo); // Загружаем файл
        const photoURL = await getFileURL(filepath); // Получаем URL

        if (!photoURL) {
            throw new Error('Failed to get photo URL');
        }

        if (auth.currentUser) {
            const promiseAuth = updateProfile(auth.currentUser, { photoURL });

            const updateData = {
                displayName: userData.displayName || null,
                rol: userData.rol || null,
                bio: userData.bio || null,
                photoURL
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
        console.error('[auth.js editMyProfilePhoto] Error al editar la foto del perfil: ', error);
        throw error;
    }
}

export async function logout() {
    return signOut(auth);
}

export function subscribeToAuthState(callback) {
    observers.push(callback);
    notify(callback);

    return () => observers = observers.filter(obs => obs !== callback);
}

function notify(callback) {
    callback({ ...userData });
}

function notifyAll() {
    observers.forEach(observer => notify(observer));
}

function updateUserData(newData) {
    userData = {
        ...userData,
        ...newData,
    }
    localStorage.setItem('user', JSON.stringify(userData));
    notifyAll();
}
