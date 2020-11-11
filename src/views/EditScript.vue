<template>
    <div class="edit-script__wrapper">
        <button
            @click="updateCreatingUpdatingState('creatingQuestion')"
        >
            Создать вопрос
        </button>

        <svg
            id="svg"
            class="edit-script"
            width="100%"
            height="100%"
            @dblclick="createQuestion"
        >
            <g id="transform-wrapper" transform="scale(1 1)" >
                <question
                    v-for="question in questionsInCurrentScript"
                    :questionId="question.id"
                    :key="question.id"
                    :currentQuestion="currentQuestion"
                    @click-edit-question="selectQuestion(question.id)"
                    @click-answer="selectAnswer"
                    @is-add-answer="selectCreateQuestion(question.id)"
                />
            </g>
        </svg>

        <create-question
            v-if="CreatingUpdatingState.creatingQuestion"
            :newQuestionCoords="newQuestionCoords"
            @close-modal="closeAllModal"
        />

        <edit-question
            v-if="CreatingUpdatingState.editingQuestion"
            :current="currentQuestion"
            @close-modal="closeAllModal"
        />

        <create-answer
            v-if="CreatingUpdatingState.creatingAnswer"
            :currentQuestion="currentQuestion"
            @close-modal="closeAllModal"
        />

        <edit-answer
            v-if="CreatingUpdatingState.editingAnswer"
            :currentQuestion="currentQuestion"
            :current="currentAnswer"
            @close-modal="closeAllModal"
        />
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    import Question from '@/components/EditScript/question/index.vue';
    import createQuestion from '@/components/EditScript/question/create.vue';
    import EditQuestion from '@/components/EditScript/question/edit.vue';
    import createAnswer from '@/components/EditScript/answer/create.vue';
    import editAnswer from '@/components/EditScript/answer/edit.vue';

    import 'vue-loading-overlay/dist/vue-loading.css';
    import 'tui-editor/dist/tui-editor.css'
    import 'tui-editor/dist/tui-editor-contents.css'
    import 'codemirror/lib/codemirror.css'

    export default {
        name: "EditScript",
        components: {
            Question,
            EditQuestion,
            createAnswer,
            editAnswer,
            createQuestion
        },
        data: () => ({
            currentQuestion: 0,
            currentAnswer: 0,
            CreatingUpdatingState: {
                creatingAnswer: false,
                creatingQuestion: false,
                editingQuestion: false,
                editingAnswer: false
            },
            isSaved: false,
            fullPage: true,
            square: {
                x: 25,
                y: 25,
            },
            newQuestionCoords: {}
        }),
        computed: {
            ...mapGetters([
                'currentScriptId',
                'questionsInCurrentScript'
            ])
        },
        mounted () {
            this.$store.dispatch('setCurrentScriptId', this.$route.params.id);
            this.$store.dispatch('setQuestionsInCurrentScript');
        },
        watch: {
            questionsInCurrentScript (val) {
                if (val !== this.questionsInCurrentScript) {
                    this.$store.dispatch('setQuestionsInCurrentScript');
                }
            }
        },
        methods: {
            ...mapActions([
                'setCurrentScriptId',
                'setQuestionsInCurrentScript'
            ]),
            closeAllModal () {
                for (let state in this.CreatingUpdatingState) {
                    this.CreatingUpdatingState[state] = false;
                }
            },
            selectQuestion (id) {
                this.currentQuestion = id;
                this.updateCreatingUpdatingState('editingQuestion');
            },
            selectAnswer (id) {
                this.currentAnswer = id;
                this.updateCreatingUpdatingState('editingAnswer');
            },
            selectCreateQuestion (id) {
                this.currentQuestion = id;
                this.updateCreatingUpdatingState('creatingAnswer');
            },
            updateCreatingUpdatingState (changingNow) {
                for (let state in this.CreatingUpdatingState) {
                    if (state == changingNow) {
                        this.CreatingUpdatingState[state] = true;
                    } else {
                        this.CreatingUpdatingState[state] = false;
                    }
                }
            },
            createQuestion (e) {
                this.newQuestionCoords = {
                    x: e.offsetX - this.square.x,
                    y: e.offsetY - this.square.y,
                };

                this.updateCreatingUpdatingState('creatingQuestion');
            }
        }
    }
</script>

<style>
    .box {
        margin: auto;
        position: center;
        display: block;
    }

    .edit-script {
        position: fixed;
        top: 150px;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
