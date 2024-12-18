// notificationService.js
import { db } from "./firebase"; // Подключаем Firebase
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Функция для получения всех уведомлений
export async function getNotifications() {
  try {
    const notificationsSnapshot = await getDocs(collection(db, "notifications"));
    const notifications = [];
    notificationsSnapshot.forEach(doc => {
      notifications.push({ ...doc.data(), id: doc.id }); // добавляем ID уведомления
    });
    return notifications;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
}

// Функция для удаления уведомления
export async function deleteNotification(notificationId) {
  try {
    const notificationRef = doc(db, "notifications", notificationId); 
    await deleteDoc(notificationRef);
    console.log(`Notification with ID ${notificationId} deleted`);
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
}
