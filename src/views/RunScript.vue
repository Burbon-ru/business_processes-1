<template>
    <div class="run_script">
        <button
            @click="startScript"
            v-if="!dialogIsStarted"
        >
            Начать разговор
        </button>

        <div v-if="dialogIsStarted">
            <question-answers
                v-for="question in questionsInMessages"
                :key="question.id"
                :question="question"
                :number="question.id"
                :currentQuestion="currentQuestion"
                :runningScriptId="runningScriptId"
                @change-step="changeStep"
            />

            <variables
                :runningScriptId="runningScriptId"
            />
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import { createRunningResult } from '@/functions/forVariables.js';

    import QuestionAnswers from '@/components/RunScript/questionAnswers.vue';
    import Variables from '@/components/RunScript/variables.vue';

    export default {
        name: "RunScript",
        data: () => ({
            currentQuestion: 0,
            questionsInMessages: [],
            dialogIsStarted: false,
            runningScriptId: 0
        }),
        components: {
            QuestionAnswers,
            Variables
        },
        computed: {
            ...mapGetters([
                'questionsInCurrentScript'
            ])
        },
        mounted () {
            this.$store.dispatch('setCurrentScriptId', this.$route.params.id);
            this.$store.dispatch('setQuestionsInCurrentScript');
        },
        watch: {
            questionsInCurrentScript (val) {
                let key = this.getKeyCurrentQuestionInQuestionsInCurrentScriptArray();

                this.currentQuestion = val[key].id;
                this.questionsInMessages.push(val[key]);
            }
        },
        methods: {
            ...mapActions([
                'setCurrentScriptId',
                'setQuestionsInCurrentScript'
            ]),
            changeStep (next) {
                this.currentQuestion = next;

                if (typeof next == 'undefined') {
                    return;
                }

                let key = this.getKeyCurrentQuestionInQuestionsInCurrentScriptArray();
                this.questionsInMessages.push(this.questionsInCurrentScript[key]);
            },
            async startScript () {
                this.dialogIsStarted = true;
                let res = await createRunningResult();

                this.runningScriptId = res.data.id;
            },
            getKeyCurrentQuestionInQuestionsInCurrentScriptArray () {
                let key = 0;

                for (let questionKey in this.questionsInCurrentScript) {
                    if (this.questionsInCurrentScript[questionKey].id == this.currentQuestion) {
                        key = questionKey;
                    }
                }

                return key;
            }
        }
    }
</script>
