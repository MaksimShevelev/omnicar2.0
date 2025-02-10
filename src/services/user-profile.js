import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, displayName: string|null, rol: string|null, bio: string|null, photoURL: string|null, telefono: string|null, marca: string|null, modelo: string|null} | null>}
 */
export async function getUserProfileById(id) {
    if (!id) {
        console.error("getUserProfileById: No especificado");
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
        telefono: data.telefono || null,
        marca: data.marca || null,
        modelo: data.modelo || null,
    };
}

/**
 * @param {string} id 
 * @param {{email: string}} data
 * @returns {Promise<void>}
 */
export async function createUserProfile(id, { email }) {
    if (!id || !email) {
        console.error("createUserProfile: No especificado");
        return;
    }
    const userRef = doc(db, `users/${id}`);
    await setDoc(userRef, { email });
}

/**
 * @param {string} id 
 * @param {{displayName: string, bio: string, photoURL: string, rol: string, telefono: string, marca: string, modelo: string}} data
 * @returns {Promise<void>}
 */
export async function editUserProfile(id, data) {
    if (!id || !data) {
        console.error("editUserProfile: No especificado");
        return;
    }
    const userRef = doc(db, `users/${id}`);
    await updateDoc(userRef, data);
}


