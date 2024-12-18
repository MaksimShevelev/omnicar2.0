<template>
    <div class="flex flex-col h-screen">
        <header class="top-0 left-0 right-0 bg-custom-green-dark p-8 text-white flex items-center justify-center relative rounded-b-lg shadow-lg z-20">
                <Popover class="absolute left-0 z-20 ml-4">
        <PopoverButton
        class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-custom-green text-white border border-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
            d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1zM1 8a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1zM1 14a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1z" />
        </svg>
        </PopoverButton>
                <transition enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1">
                    <PopoverPanel class="absolute left-0 z-10 mt-5 flex w-screen max-w-max px-4">
                        <div
                            class="w-64 flex-auto overflow-hidden rounded-3xl bg-white text-sm shadow-lg ring-1 ring-gray-900/5">
                            <div class="flex flex-col w-64 bg-white text-white">
                                <nav class="flex-1 px-2 py-4 space-y-2 border-t border-gray-300">
                                    <BaseHeading1>
                                        <h6 class="mb-3 text-center text-black">{{ loggedUser.displayName || '' }}</h6>
                                        
                                    </BaseHeading1>
                                    <div class="scale-75"> <ProfileData :user="loggedUser" /></div>
                                    
                                    <router-link
                                        class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                        to="/home">
                                        <span>Home</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                                            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                                        </svg>
                                    </router-link>

                                    <template v-if="loggedUser.id === null">
                                        <router-link
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                            to="/start"> 
                                            <span>Iniciar sesión</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd"
                                                    d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                                                <path fill-rule="evenodd"
                                                    d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                            </svg>
                                        </router-link>
                                    </template>

                                    <template v-else>
                                        <router-link
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                            to="/mi-perfil">
                                            <span>Mi perfíl</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

                                        </router-link>
                                        <router-link
                                        class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                        to="/mis-viajes">
                                        <span>Mis viajes</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
                                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                                        </svg>
                                        </router-link>
                                            <router-link
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                            to="/home">
                                            <span>Canjear cupón</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>



                                        </router-link>
                                        <router-link
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                            to="/home">
                                            <span>Invitar amigos</span>
                                            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>

                                        </router-link>
                                        <router-link
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300"
                                            to="/home">
                                            <span>Soporte</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
</svg>



                                        </router-link>
                                        <form @submit.prevent="handleLogout"
                                            class="flex items-center justify-between px-4 py-2 text-gray-900 hover:bg-custom-green hover:text-white rounded-md border-b border-gray-300">
                                            <button type="submit" class="flex items-center justify-between w-full">
                                                <span >Cerrar sesión</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                                </svg>
                                            </button>
                                        </form>
                                    </template>
                                </nav>
                            </div>
                        </div>
                    </PopoverPanel>
                </transition>
            </Popover>
            
            <NotificationBell class="absolute right-0 z-20 mr-4"/>
                

        </header>
        <main class="container lg:p-2 md:p-2 sm:p-1 flex-1 mx-auto">
            <router-view />
        </main>
        <footer class="fixed bottom-0 left-0 right-0 pt-4 pb-2 z-5 bg-custom-green-dark text-white flex justify-around items-center h-20 rounded-t-lg mt-4">
            <router-link to="/buscar" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
                <span class="pt-2">Buscar</span>
            </router-link>        
            <router-link to="/crear" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                <span class="pt-2">Crear</span>
            </router-link>          
            <router-link to="/eventos" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-calendar2-heart" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm2 .5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5zm5 4.493c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                </svg>
                <span class="pt-2">Eventos</span>
            </router-link>
                        
            <router-link to="/viajes" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                    </svg>
                <span class="pt-2">Viajes</span>
            </router-link>
                        
            <router-link to="/chats" class="footer-link text-center rounded-t-lg text-white hover:text-gray-900 hover:bg-green-400 pt-3 pb-3 pl-5 pr-5 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                </svg>
                <span class="pt-1">Chat</span>
            </router-link>
        </footer>
    </div>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { logout, subscribeToAuthState } from './services/auth'
import { ref } from 'vue'


const loggedUser = ref({
    id: null,
    email: null,
    displayName: 'Guest'
})

function handleLogout() {
    logout()
    loggedUser.value = { id: null, email: null, displayName: 'Guest' }
}

subscribeToAuthState((newUserData) => {
    loggedUser.value = newUserData
})
</script>


<script>
import { computed } from 'vue';
import BaseHeading1 from './components/BaseHeading1.vue';
import ProfileData from './components/profile/ProfileData.vue';
import NotificationBell from './components/NotificationBell.vue';

export default {
    name: 'App',
    components: { BaseHeading1, ProfileData, NotificationBell },
    data() {
        return {
            loggedUser: {
                id: null,
                displayName: null,
                photoURL: null,
            },
        };
    }
};
</script>



<style scoped>
.border-custom-green {
    border-color: #239e61; 
}


header {
  display: flex;
  justify-content: center;
  position: relative; 
}

header .absolute.left-0 {
  left: 0;
}

header .absolute.right-0 {
  right: 0;
}


footer{
    z-index: 9990;
}
</style>