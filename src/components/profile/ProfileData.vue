<script>
export default {
    name: 'ProfileData',
    props: {
        user: {
            type: Object,
            required: true,
        }
    }
}
</script>

<template>
    <div class="flex flex-col items-center">
        <div class="w-full flex justify-center ">
            <img 
                v-if="user.photoURL"
                :src="user.photoURL"
                alt="Foto de perfil"
                class="rounded-full w-32 h-32 object-cover border-2 border-custom-green"
            >
            <p v-else class="text-gray-500 text-center">Sin foto de perfil</p>
        </div>
        <!--<div class="mt-4">
            <div class="mb-4">{{ user.bio || 'Acá va mi biografía...' }}</div>
            <dl>
                <dt class="font-bold">Email:</dt>
                <dd class="mb-3">{{ user.email }}</dd>
                <dt class="font-bold">Nombre de Usuario:</dt>
                <dd class="mb-3">{{ user.displayName || 'Sin especificar' }}</dd>
                <dt class="font-bold">Carrera:</dt>
                <dd class="mb-3">{{ user.bio || 'Sin especificar' }}</dd>
            </dl>
        </div>-->
    </div>
</template>