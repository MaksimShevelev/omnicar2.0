<template>
    <BaseHeading1 class="flex gap-4 text-3xl text-gray-90 mt-40">Lista de viajes</BaseHeading1>
    <div class="flex gap-4 mb-40">
        <section class="w-full">
            <div class="p-4 border rounded">
                <BaseLoader v-if="loadingMessages" />
                
                <ul class="flex flex-col gap-4">
                    <li v-for="message in messages" :key="message.id">
                        <div class="bg-white p-4 border rounded shadow-md">
                            <!-- Информация о поездке -->
                            <div class="mb-1">
                                <router-link :to="`/usuario/${message.user_id}`" class="font-bold text-blue-700 underline">
                                    {{ message.email || 'Неизвестный пользователь' }}
                                </router-link>
                                <span> - Viaje del <b>{{ message.rol || 'без роли' }}</b> - <b>{{ message.displayName || 'Имя отсутствует' }}</b></span>
                            </div>
                            <div><strong>Fecha de creación:</strong> {{ formatDate(message.created_at) }}</div>
                            <div><strong>Fecha de viaje:</strong> {{ message.date || 'Не указана' }}</div>
                            <div><strong>Hora de viaje:</strong> {{ message.time || 'Не указано' }}</div>
                            <div><strong>Origen:</strong> {{ message.origin || 'Не указан' }}</div>
                            <div><strong>Destino:</strong> {{ message.destination || 'Не указано' }}</div>
                            
<div class="flex items-center">
    <strong>Tipo:</strong> 
    <span v-if="message.type && message.type.icon" v-html="message.type.icon" class="ml-2"></span>
    <span class="ml-2">{{ message.type?.name || 'Не указан' }}</span>
</div>

                            <div><strong>Cantidad de asientos:</strong> {{ message.numSeats || 'Не указано' }}</div>
                            
                            <div class="flex space-x-3 mt-3">
    <span v-for="option in message.options" :key="option.name" v-html="option.icon"></span>
</div>

                            <div v-if="message.mapSnapshot">
                                <img 
                                    :src="message.mapSnapshot" 
                                    alt="Mapa de la ruta" 
                                    class="rounded mt-4 max-w-full h-auto"
                                />
                            </div>
                            <div v-else>
                                <p>Изображение карты недоступно</p>
                            </div>

                            <!-- Отображение цены -->
                            <div><strong>Precio por asiento:</strong> {{ message.price }} $ ARS</div>

                            <!-- Кнопка "Резервировать" -->
                            <button type="submit" class="mt-2 transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
                                Reservar
                            </button>

                            <!-- Секция комментариев -->
                            <div class="bg-gray-200 p-4 rounded mt-4 w-9/12">
                                <h3 class="text-lg mt-2">Comentarios</h3>
                                <ul class="ml-4">
                                    <li v-for="comment in comments[message.id]" :key="comment.id">
                                        <b>{{ comment.rol }}</b> - <b>{{ comment.displayName }}:</b> {{ comment.text }}
                                    </li>
                                </ul>
                                <form @submit.prevent="handleCommentSubmit(message.id)" class="mt-2">
                                    <textarea v-model="newComment[message.id]" class="w-full min-h-8 p-2 border rounded"></textarea>
                                    <button type="submit" class="mt-2 transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
                                        Enviar comentario
                                    </button>
                                </form>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import { subscribeToAuthState } from '../services/auth.js';
import { saveChatMessage, subscribeToChatMessages, saveComment, subscribeToComments, subscribeToTrips } from '../services/viajes.js';
import { getUserProfileById } from '../services/user-profile.js'; // Импорт функции для получения профиля

export default {
    name: 'Viajes',
    components: { BaseHeading1, BaseLoader },
    data() {
        return {
            loadingMessages: false,
            messages: [],
            trips: [], 
            newMessage: {
                user_id: '',
                text: '',
                created_at: '',
                price: '',
            },
            comments: {},
            newComment: {},
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                rol: null,
                bio: null,
            },
            unsubscribeChat: null,
        };
    },
    methods: {
        async loadUserProfile(message) {
            // Загружаем профиль пользователя и добавляем данные в message
            const profile = await getUserProfileById(message.user_id);
            if (profile) {
                message.email = profile.email;
                message.displayName = profile.displayName;
                message.rol = profile.rol;
            } else {
                message.email = 'Неизвестный пользователь';
                message.displayName = 'Имя отсутствует';
                message.rol = 'без роли';
            }
        },
        
        // Метод для публикации поездки
        handleSubmit() {
            try {
                saveChatMessage({
                    user_id: this.loggedUser.id,
                    email: this.loggedUser.email,
                    text: this.newMessage.text,
                    displayName: this.loggedUser.displayName,
                    rol: this.loggedUser.rol,
                    price: this.newMessage.price,
                });
                this.newMessage.text = '';
                this.newMessage.price = '';
            } catch (error) {
                console.error("Ошибка при сохранении сообщения:", error);
            }
        },

        // Метод для обработки комментариев
        async handleCommentSubmit(messageId) {
            if (!this.newComment[messageId]?.trim()) {
                console.error("El texto del comentario está vacío");
                return;
            }

            await saveComment({
                viajeId: messageId,
                user_id: this.loggedUser.id,
                text: this.newComment[messageId],
                displayName: this.loggedUser.displayName || 'Anónimo',
                rol: this.loggedUser.rol,
            });

            this.newComment[messageId] = '';
            this.fetchComments(messageId);
        },
        
        // Метод для загрузки комментариев
        fetchComments(messageId) {
            subscribeToComments(messageId, (comments) => {
                if (!this.comments[messageId]) {
                    this.comments[messageId] = [];
                }
                this.comments[messageId] = comments;
            });
        },

        formatDate(date) {
            if (!date) return null;

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
            return formatter.format(date).replace(',', '');
        }
    },
    async mounted() {
        this.loadingMessages = true;
        this.unsubscribeChat = subscribeToChatMessages(async (newMessages) => {
            this.loadingMessages = false;
            // Загружаем профиль пользователя для каждого сообщения
            for (const message of newMessages) {
                await this.loadUserProfile(message);
            }
            this.messages = newMessages;
        });

        this.unsubscribeAuth = subscribeToAuthState(newUserData => this.loggedUser = newUserData);

        subscribeToTrips((fetchedTrips) => {
            this.trips = fetchedTrips;
        });
    },
    
    unmounted() {
        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
        }
        if (typeof this.unsubscribeChat === 'function') {
            this.unsubscribeChat();
        } else {
            console.warn('unsubscribeChat is not a function or is null');
        }
    }
}
</script>
