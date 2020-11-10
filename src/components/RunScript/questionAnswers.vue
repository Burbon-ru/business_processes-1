<template>
    <div
        class="question-answers"
    >
        <messages
            :currentQuestion="question.id"
            :answer="answer"
        />

        <select-answer
            @next-answer="nextAnswer"
            :currentQuestion="question.id"
            v-if="question.id == currentQuestion"
        />
    </div>
</template>

<script>
    import SelectAnswer from '@/components/RunScript/selectAnswer.vue';
    import Messages from '@/components/RunScript/messages.vue';

    export default {
        name: "questionAnswers",
        props: ['question', 'number', 'currentQuestion'],
        components: {
            SelectAnswer,
            Messages
        },
        data: () => ({
            answer: ''
        }),
        methods: {
            nextAnswer (e) {
                this.answer = e.label;
                this.$emit('change-step', e.next);
            }
        }
    }
</script>

<style>
    .question-answers {
        display: flex;
        flex-direction: column;
        min-height: 100%;
    }
</style>
