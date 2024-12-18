<template>
    <div class="comments-section">
        <p class="text-lg">Preguntas</p>
        <ul>
            <li v-for="comment in comments" :key="comment.id">
                <b>{{ comment.displayName }}:</b> {{ comment.text }}
            </li>
        </ul>

        <form @submit.prevent="handleCommentSubmit">
            <textarea v-model="newComment.text" class="w-full min-h-8 p-2 border rounded"
                ></textarea>
            <button type="submit"
                class="transition-all py-2 px-4 rounded bg-green-700 text-white focus:bg-green-500 hover:bg-green-500 active:bg-green-900">
                Enviar
            </button>
        </form>
    </div>
</template>

<script>
import { saveComment, subscribeToComments } from '../services/viajes.js';

export default {
    props: {
        viajeId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            comments: [],
            newComment: {
                text: '',
            },
        };
    },
    methods: {
        async handleCommentSubmit() {
            if (this.newComment.text.trim()) { 
                await saveComment(this.viajeId, {
                    text: this.newComment.text,
                    displayName: this.$store.state.loggedUser.displayName,
                });
                this.newComment.text = ''; 
            }
        },
        fetchComments() {
            subscribeToComments(this.viajeId, (comments) => {
                this.comments = comments;
            });
        },
    },
    mounted() {
        this.fetchComments(); 
    },
};
</script>
