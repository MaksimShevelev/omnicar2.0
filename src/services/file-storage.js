import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * 
 * @param {string} path
 * @param {Blob} file 
 * @returns {Promise<string>} 
 */
export async function uploadFile(path, file) {
    const fileRef = ref(storage, path);

    try {
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef); 
    } catch (error) {
        console.error("Error al cargar el archivo a Storage:", error);
        throw error;
    }
}

/**
 * 
 * @param {string} path 
 * @returns {Promise<string>} 
 */
export async function getFileURL(path) {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
}
