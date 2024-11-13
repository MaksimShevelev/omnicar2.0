<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import ProfileData from '../components/profile/ProfileData.vue';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { BaseHeading1, ProfileData, BaseLoader },
    data() {
        return {
            loading: false,
            user: null, // Начально пустой, чтобы избежать ошибок
        }
    },
async mounted() {
    this.loading = true;
    const userId = this.$route.params.id;

    if (!userId) {
        console.error("User ID is missing in route parameters.");
        this.loading = false;
        return;
    }

    try {
        this.user = await getUserProfileById(userId);
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
    
    this.loading = false;
}

}
</script>

<template>
    <BaseLoader class="mt-4 mb-40" v-if="loading" />
    <template v-else>
        <div class="" v-if="user">
            
            <div class="sm:col-span-4">
      <label class="block text-sm font-medium text-gray-900"><BaseHeading1>Perfil de {{ user.email }}</BaseHeading1></label>
      <div class="mt-2 flex justify-start">
            <ProfileData :user="user" />
        </div>
    </div>
            <p><strong>Email:</strong> {{ user.email }}</p>
                <p v-if="user.displayName"><strong>Nombre:</strong> {{ user.displayName }}</p>
                <p v-if="user.rol"><strong>Rol:</strong> {{ user.rol }}</p>
                <p v-if="user.bio"><strong>Biografía:</strong> {{ user.bio }}</p>
            <hr class="mb-4">
            <router-link
                :to="`/usuario/${user.id}/chat`"
                class="text-blue-700 underline"
            >Conversación Privada con {{ user.email }}</router-link>
        </div>
        <div v-else>
            <p>Usuario no encontrado.</p> <!-- Сообщение, если пользователь не найден -->
        </div>
    </template> 
</template>



