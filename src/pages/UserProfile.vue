<template>
    <BaseLoader v-if="loading" />
    <template v-else>
        <div class="m-4 text-center" v-if="user">

            <div class="sm:col-span-4">
                <label class="block text-xl font-medium m-2 text-green-700">
                    <h1>¡El asiento ha sido reservado con éxito!</h1>
                </label>
                <div class="m-2 flex text-center justify-center">
                    <ProfileData :user="user" />
                </div>
            </div>

            <p v-if="user.displayName"><strong>Nombre:</strong> {{ user.displayName }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <h3 class="mt-4"><strong>Para contactarte con el conductor podés escribirle <div class="boton">
            <router-link :to="`/usuario/${user.id}/chat`"
                class="boton m-4 px-4 py-2 bg-green-600 text-white rounded text-lg font-semibold transition-all focus:bg-green-500 hover:bg-green-500 active:bg-green-900">aquí</router-link></div></strong></h3>
        </div>
        <div v-else>
            <p>Usuario no encontrado.</p> 
        </div>
    </template>
</template>


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
            user: null, 
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


<style>
@media (max-width: 640px) {
 

    .boton {
    margin-top: 15px; /* Меньше паддинга на мобильных экранах */
   }
   }
   @media (max-width: 800px) {
 

 .boton {
 margin-top: 15px; /* Меньше паддинга на мобильных экранах */
}
}
   </style>