
<template>

<div v-if="publications.length" class="col-span-full">
    <h2 class="text-lg font-bold text-gray-900">Mis viajes publicados</h2>
    <ul>
      <li v-for="publication in publications" :key="publication.id" class="mb-3 mt-4">
        <p><strong>{{ publication.displayName }}</strong> - {{ publication.text }}</p>
        <p><em>{{ publication.created_at.toDate().toLocaleString() }}</em></p>
      </li>
    </ul>
  </div>

</template>


<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import BaseHeading1 from '../components/BaseHeading1.vue';
  import ProfileData from '../components/profile/ProfileData.vue';
  import { subscribeToAuthState } from '../services/auth';
  import { getUserPublications } from '../services/publications';
  
  const loggedUser = ref({
    id: null,
    email: null,
    displayName: 'Guest',
    rol: null,
    bio: null,
    photoURL: null,
    firstName: '',
    lastName: '',
    country: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: ''
  });
  
  const publications = ref([]);
  
  let unsubscribeAuth = () => {};
  
  onMounted(() => {
    unsubscribeAuth = subscribeToAuthState(async (newUserData) => {
      loggedUser.value = newUserData;
  
      if (loggedUser.value.id) {
        try {
          publications.value = await getUserPublications(loggedUser.value.id);
        } catch (error) {
          console.error("Error al cargar publicaciones:", error);
        }
      }
    });
  });
  
  onUnmounted(() => {
    unsubscribeAuth();
  });
  </script>


