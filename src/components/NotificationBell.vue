<template>
  <Popover>
    <PopoverButton
      class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-custom-green text-white border border-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      @click="toggleNotifications">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bell-fill"
        viewBox="0 0 16 16">
        <path
          d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
      </svg>
      <span v-if="notificationCount > 0" class="notification-count">{{ notificationCount }}</span>
    </PopoverButton>

    <PopoverPanel class="absolute right-0 z-10 mt-5 w-64 px-4">
      <transition enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1">
        <div class="w-full flex-auto overflow-hidden rounded-3xl bg-white text-sm shadow-lg ring-1 ring-gray-900/5">
          <div class="flex flex-col w-full bg-white text-gray-900 p-4">
            <h2 class="text-xl">Notificaciones</h2>
            <ul class="notification-list">
              <li v-for="(notification, index) in filteredNotifications" :key="index" class="notification-item">
                <p>Tenes nuevo mensaje de <strong> {{ notification.senderName }} </strong> </p>
                <div class="mt-2 mb-2">
                  <!-- Добавим событие для удаления уведомления -->
                  <router-link 
                    :to="`/usuario/${notification.sender_id}/chat`"
                    class="bg-green-600 px-2 py-2 text-white rounded-lg text-center"
                    @click="deleteNotification(notification.id)">
                    Ver
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </PopoverPanel>
  </Popover>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getNotifications } from "../services/notificationService.js"; // Сервис для получения уведомлений
import { getUsersProfiles } from "../services/private-chat"; // Сервис для получения профилей пользователей
import { useAuth } from "../services/auth"; // Хук для работы с авторизацией
import { deleteNotification } from "../services/notificationService.js"; // Функция для удаления уведомления

export default {
  setup() {
    const { userData } = useAuth(); // Получаем данные текущего пользователя
    const notifications = ref([]); // Список всех уведомлений
    const notificationCount = computed(() => {
      return notifications.value.filter(
        (notification) => notification.receiver_id === userData.id
      ).length;
    });

    const filteredNotifications = computed(() => {
      return notifications.value.filter(
        (notification) => notification.receiver_id === userData.id
      );
    });

    // Функция для получения уведомлений
    onMounted(async () => {
      notifications.value = await getNotifications();

      // Извлекаем уникальные sender_id из уведомлений
      const senderIds = [...new Set(notifications.value.map(notification => notification.sender_id))];

      // Получаем профили пользователей
      const profiles = await getUsersProfiles(senderIds);

      // Присваиваем каждому уведомлению имя отправителя
      notifications.value = notifications.value.map(notification => {
        const senderProfile = profiles.find(profile => profile.id === notification.sender_id);
        return {
          ...notification,
          senderName: senderProfile ? senderProfile.displayName : 'Имя не доступно'
        };
      });
    });

    // Функция для удаления уведомления
    function deleteNotificationFromDatabase(notificationId) {
      // Здесь теперь передаем именно идентификатор уведомления
      deleteNotification(notificationId);
    }

    // Функция для переключения видимости уведомлений
    function toggleNotifications() {
      // showNotifications не нужен, так как это управляется через Popover
    }

    return {
      notificationCount,
      filteredNotifications,
      toggleNotifications,
      deleteNotification: deleteNotificationFromDatabase
    };
  }
};
</script>

<style scoped>
/* Стили остаются без изменений */
.bell-container {
  position: relative;
  display: inline-block;
}

.bell {
  position: relative;
  cursor: pointer;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  font-size: 12px;
  border-radius: 20%;
  padding: 2px 6px;
}

.notification-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  padding: 8px;
  border-bottom: 1px solid #f1f1f1;
}

.notification-item:last-child {
  border-bottom: none;
}

.bg-green-600 {
  background-color: #16a34a;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.text-white {
  color: rgb(255, 255, 255);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.text-center {
  text-align: center;
}
</style>
