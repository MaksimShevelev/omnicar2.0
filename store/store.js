// store/index.js

import { createStore } from 'vuex';

export default createStore({
  state: {
    unreadNotifications: 0,  // Количество непрочитанных уведомлений
  },
  mutations: {
    incrementNotifications(state) {
      state.unreadNotifications += 1;  // Увеличиваем счетчик уведомлений
    },
    resetNotifications(state) {
      state.unreadNotifications = 0;  // Сбрасываем уведомления
    },
  },
  actions: {
    markNotificationAsRead({ commit }) {
      commit('resetNotifications');
    },
    newMessageReceived({ commit }) {
      commit('incrementNotifications');
    },
  },
  getters: {
    unreadNotifications(state) {
      return state.unreadNotifications;  // Получаем количество уведомлений
    },
  },
});
