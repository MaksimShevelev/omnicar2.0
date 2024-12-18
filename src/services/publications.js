import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from './firebase'; 
export async function getUserPublications(userId) {
    const viajesRef = collection(db, "viajes");
    const q = query(viajesRef, where("user_id", "==", userId));

    try {
        const querySnapshot = await getDocs(q);
        const publications = [];
        querySnapshot.forEach((doc) => {
            publications.push({ id: doc.id, ...doc.data() });
        });
        return publications;
    } catch (error) {
        console.error("No especificado:", error);
        throw new Error("No especificado.");
    }
}
