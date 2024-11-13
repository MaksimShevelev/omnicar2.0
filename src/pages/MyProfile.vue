<template>
    <div class="space-y-12 mb-40">
      <!-- Заголовок и ссылки для редактирования -->
      <div class="flex items-end gap-4 mt-4">
        <BaseHeading1 class="text-center text-3xl text-gray-900">Mi perfíl</BaseHeading1>
        <router-link to="/mi-perfil/editar" class="mb-4 text-blue-700 underline">Editar</router-link>
        <router-link to="/mi-perfil/editar/foto" class="mb-4 text-blue-700 underline">Editar foto</router-link>
      </div>
  
      <!-- Информация профиля и компоненты -->
      <section class="border-b border-gray-900/10 pb-12">
  <p class="mt-1 text-xl text-gray-600">
    Esta información se mostrará públicamente
  </p>

  <!-- Данные профиля (отображение) -->
  <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
    
    <div class="sm:col-span-4">
      <label class="block text-sm font-medium text-gray-900">Foto</label>
      <div class="mt-2 flex justify-start">
        <ProfileData :user="loggedUser" class="self-start" />
      </div>
    </div>

          <div class="sm:col-span-4">
            <label class="block text-sm font-medium text-gray-900">Nombre</label>
            <p class="text-gray-700">{{ loggedUser.displayName || 'Sin especificar' }}</p>
          </div>

          <div class="col-span-full">
            <label class="block text-sm font-medium text-gray-900">Tipo de usuario</label>
            <p class="text-gray-700 mt-2">{{ loggedUser.rol || 'Sin especificar' }}</p>
          </div>
  
          <div class="col-span-full">
            <label class="block text-sm font-medium text-gray-900">Sobre mí</label>
            <p class="text-gray-700 mt-2">{{ loggedUser.bio || 'Sin especificar' }}</p>
          </div>

          <div class="sm:col-span-4">
            <label class="block text-sm font-medium text-gray-900">Email</label>
            <p class="text-gray-700">{{ loggedUser.email || 'Sin especificar' }}</p>
          </div>


          <div class="col-span-full">
  <label for="phone" class="block text-sm/6 font-medium text-gray-900">Número de teléfono</label>
  <div class="mt-2">
    <p class="text-gray-700">{{ loggedUser.telefono || 'Sin especificar' }}</p>
  </div>
</div>



          <div><h3>Documentos</h3>
            <div class="col-span-full">
            <label for="photo" class="block text-sm/6 font-medium text-gray-900">Foto de DNI</label>
            <div class="mt-2 flex items-center gap-x-3">
              <UserCircleIcon class="h-12 w-12 text-gray-300" aria-hidden="true" />
        
            </div>
          </div>

          <div class="col-span-full">
            <label for="photo" class="block text-sm/6 font-medium text-gray-900">Foto de licencia</label>
            <div class="mt-2 flex items-center gap-x-3">
              <UserCircleIcon class="h-12 w-12 text-gray-300" aria-hidden="true" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-900">Métodos de pago</label>
            <p class="text-gray-700">{{ loggedUser.postalCode || 'Sin especificar' }}</p>
          </div>
        
        </div>
        </div>
      </section>
  
      <section class="border-b border-gray-900/10 pb-12">
  <h2 class="text-xl font-semibold text-gray-900">Información sobre auto</h2>

  <div class="mt-10 space-y-8">
    <div>
      <label for="photo" class="block text-sm font-medium text-gray-900">Foto</label>
      <div class="mt-2 flex items-center gap-x-3">
        <UserCircleIcon class="h-12 w-12 text-gray-300" aria-hidden="true" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900">Marca</label>
      <p class="text-gray-700">{{ loggedUser.firstName || 'Sin especificar' }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900">Modelo</label>
      <p class="text-gray-700">{{ loggedUser.lastName || 'Sin especificar' }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900">Año</label>
      <p class="text-gray-700">{{ loggedUser.country || 'Sin especificar' }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900">Color</label>
      <p class="text-gray-700">{{ loggedUser.streetAddress || 'Sin especificar' }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900">Tipo de combustible</label>
      <p class="text-gray-700">{{ loggedUser.city || 'Sin especificar' }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900">Consumo promedio</label>
      <p class="text-gray-700">{{ loggedUser.region || 'Sin especificar' }}</p>
    </div>
  </div>
</section>

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
  
  