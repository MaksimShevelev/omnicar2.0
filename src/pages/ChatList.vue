<template>
            <div class="absolute inset-0 -z-10 transform-gpu blur-3xl opacity-20" aria-hidden="true">
            <div class="aspect-[1097/845] w-full h-full bg-gradient-to-tr from-[#239e61] to-[#1d7e4b]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            ></div>
        </div>
  <div class="chat-list">
    <BaseHeading1 class="flex flex-col rounded-x justify-center text-3xl items-center text-center mt-4">Chats
  </BaseHeading1>


    <ul v-if="chats.length">
      <li v-for="chat in chats" :key="chat.chatId" class="mb-2">
        <router-link :to="`/usuario/${chat.otherUserId}/chat`" class="text-blue-700 underline">
          <h2 class="inline-flex text-xl my-2 p-4 border rounded-xl shadow text-green-700">Chat con {{ chat.otherUser?.displayName || 'Имя отсутствует' }}</h2>
        </router-link>
      </li>
    </ul>

    <p v-else>Todavia no hay chats</p>
  </div>
</template>

<script>
import { getUserPrivateChats, getUsersProfiles } from '../services/private-chat';
import { subscribeToAuthState } from '../services/auth';

export default {
  name: 'ChatList',
  data() {
    return {
      loggedUserId: null,
      chats: [],
    };
  },
  async mounted() {
    subscribeToAuthState(user => {
      if (user && user.id) {
        this.loggedUserId = user.id;
        this.loadChats();
      }
    });
  },
  methods: {
    async loadChats() {
      if (!this.loggedUserId) return;

      try {
        const userChats = await getUserPrivateChats(this.loggedUserId);
        const userIds = userChats.map(chat => chat.otherUserId);
        const profiles = await getUsersProfiles(userIds);

        this.chats = userChats.map(chat => ({
          chatId: chat.chatId,
          otherUserId: chat.otherUserId,
          otherUser: profiles.find(profile => profile?.id === chat.otherUserId),
        }));
      } catch (error) {
        console.error("Ошибка при загрузке чатов:", error);
      }
    }
  }
};
</script>

<style scoped>
.chat-list {
  max-width: 600px;
  margin: auto;
  padding: 16px;
}
</style>
