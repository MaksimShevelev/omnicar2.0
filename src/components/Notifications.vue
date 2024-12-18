<template>
  <div>
    <!-- Отображаем уведомление, если есть непрочитанные уведомления -->
      <!-- Кнопка уведомлений с красным кружком с цифрой -->
      <div class="absolute top-0 right-0 z-50">


          <!-- Красный круг с числом уведомлений -->
          <div v-if="unreadNotifications > 0" class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {{ unreadNotifications }}
          </div>

      </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'Notifications',
  setup() {
    const store = useStore(); // Используем useStore для доступа к хранилищу Vuex

    // Извлекаем количество уведомлений с помощью геттера
    const unreadNotifications = computed(() => store.getters.unreadNotifications);

    return {
      unreadNotifications,
    };
  },
};
</script>

<style scoped>
/* Добавляем стили для уведомлений */
.bg-custom-green {
  background-color: #239e61;
}

/* Стили для красного круга с цифрой */
.relative {
  position: relative;
}

.bg-red-500 {
  background-color: #f87171;
}

/* Плавное появление круга с уведомлением */
.transition-all {
  transition: all 0.3s ease;
}
</style>
