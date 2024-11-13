<template>
    <BaseLoader v-if="loadingUser" />
    <BaseHeading1 class="text-center text-3xl text-gray-900 mt-4 mb-40" v-else>Chat con {{ user.displayName }}</BaseHeading1>

    <div class="min-h-[400px] p-4 mb-4 border rounded" v-if="!loadingUser">
        <ul class="flex flex-col items-start gap-4">
            <li
                v-for="message in messages"
                :key="message.id"
                :class="{
                    'bg-gray-200': message.user_id !== loggedUser.id,
                    'bg-green-200': message.user_id === loggedUser.id,
                    'self-end': message.user_id === loggedUser.id,
                }"
                class="p-4 rounded"
            >
                <div>{{ message.text }}</div>
                <div class="text-md text-gray-600">{{ formatDate(message.created_at) || 'Enviando...' }}</div>
            </li>
        </ul>
    </div>

    <form 
        action="#"
        class="flex gap-4 items-stretch mb-40"
        @submit.prevent="handleSubmit"
    >
        <label 
            for="text"
            class="sr-only"
        >Mensaje</label>
        <textarea
            id="text"
            class="w-full min-h-8 p-2 border rounded"
            v-model="newMessage.text"
        ></textarea>
        <button 
            type="submit"
            class="transition-all pmt-4 py-2 px-6 rounded bg-green-700 text-white"
        >Enviar</button>
    </form>
</template>

<script>

import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import { subscribeToAuthState } from '../services/auth';
import { getUserProfileById } from '../services/user-profile';
import { savePrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chat';

let unsubscribeAuth = () => {};
let unsubscribeChat = () => {};

export default {
    name: 'PrivateChat',
    components: { BaseHeading1, BaseLoader },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                bio: null,
                career: null,
            },
            loadingUser: false,
            user: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                bio: null,
            },
            loadingMessages: false,
            messages: [],
            newMessage: {
                text: '',
            }
        };
    },
    methods: {
        async handleSubmit() {
            try {
                await savePrivateChatMessage(
                    this.loggedUser.id,
                    this.$route.params.id,
                    this.newMessage.text,
                );
                this.newMessage.text = '';
            } catch (error) {
                // TODO: обработка ошибок
            }
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
        unsubscribeAuth = subscribeToAuthState(newUserData => this.loggedUser = newUserData);
        this.loadingUser = true;

        try {
            const userProfile = await getUserProfileById(this.$route.params.id);
            this.loadingUser = false;
            this.user = userProfile;
        } catch (error) {
            this.loadingUser = false;
            // TODO: обработка ошибок
        }
        
        this.loadingMessages = true;
        unsubscribeChat = await subscribeToPrivateChatMessages(
            this.loggedUser.id,
            this.$route.params.id,
            newMessages => {
                this.loadingMessages = false;
                this.messages = newMessages;
            }
        );
    },
    unmounted() {
        unsubscribeAuth();
        unsubscribeChat();
    }
}
</script>
