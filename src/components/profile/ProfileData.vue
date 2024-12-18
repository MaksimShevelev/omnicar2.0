<template>
    <div class="flex flex-col items-center">
        <div class="w-full flex justify-center ">
            <img 
                v-if="user.photoURL"
                :src="user.photoURL"
                alt="Foto de perfil"
                class="rounded-full w-32 h-32 object-cover border-2 border-custom-green"
            >
            <p v-else class="text-gray-500 text-center"></p>
        </div>
    </div>
</template>

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