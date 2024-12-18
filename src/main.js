import './style.css';
import { createApp } from 'vue';
import router from './router/router';
import App from './App.vue';
import store from '../store/store.js'; // Подключаем Vuex store
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

const app = createApp(App);
app.use(store);
app.component('Popover', Popover);
app.component('PopoverButton', PopoverButton);
app.component('PopoverPanel', PopoverPanel);

app.use(router); 

app.mount('#app');

