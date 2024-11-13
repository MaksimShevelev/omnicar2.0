import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Загружает файл в Firebase Storage и возвращает URL загруженного файла.
 * @param {string} path - Путь для сохранения в Storage.
 * @param {Blob} file - Файл в формате Blob.
 * @returns {Promise<string>} URL загруженного файла.
 */
export async function uploadFile(path, file) {
    const fileRef = ref(storage, path);

    try {
        // Загружаем файл и возвращаем URL после успешной загрузки
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef); // Получаем нужный URL сразу после загрузки
    } catch (error) {
        console.error("Ошибка при загрузке файла в Storage:", error);
        throw error;
    }
}

/**
 * Получает URL файла по пути в Firebase Storage.
 * @param {string} path - Путь к файлу в Storage.
 * @returns {Promise<string>} URL файла.
 */
export async function getFileURL(path) {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
}
