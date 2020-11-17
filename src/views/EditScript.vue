<template>
    <div class="edit-script__wrapper">
        <svg
            id="svg"
            class="edit-script"
            width="100%"
            height="100%"
            @dblclick="createQuestion"
            ref="dynamicLine"
        >
            <g id="transform-wrapper" transform="scale(1 1)" >
                <question
                    v-for="question in questionsInCurrentScript"
                    :questionId="question.id"
                    :key="question.id"
                    @click-question-edit="selectEditQuestion(question.id)"
                    @click-answer-edit="selectEditAnswer"
                    @click-answer-add-mousedown="drag"
                />
            </g>

            <path
                :d="pathCoords"
                :transform="stylesCoords"
                fill="transparent"
                stroke="#4294ff"
                stroke-width="1"
                marker-end="url(#arrow)"
            />
        </svg>

        <!-- Компонент-модальное окно создания вопроса -->
        <create-question
            v-if="CreatingUpdatingState.creatingQuestion"
            :newQuestionCoords="newQuestionCoords"
            @close-modal="closeAllModal"
        />

        <!-- Компонент-модальное окно редактирования вопроса -->
        <edit-question
            v-if="CreatingUpdatingState.editingQuestion"
            :current="currentQuestion"
            @close-modal="closeAllModal"
        />

        <!-- Компонент-модальное окно создания ответа -->
        <create-answer
            v-if="CreatingUpdatingState.creatingAnswer"
            :currentQuestion="currentQuestion"
            :newAnswerCoords="newAnswerCoords"
            @close-modal="closeAllModal"
        />

        <!-- Компонент-модальное окно редактирования ответа -->
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

    // стили для текстового редактора
    import 'tui-editor/dist/tui-editor.css'
    import 'tui-editor/dist/tui-editor-contents.css'

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
            square: {
                x: 25,
                y: 25,
            },
            newQuestionCoords: {},
            newAnswerCoords: {},
            dragOffsetX: null,
            dragOffsetY: null,
            pathCoords: '',
            stylesCoords: ''
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
        methods: {
            ...mapActions([
                'setCurrentScriptId',
                'setQuestionsInCurrentScript'
            ]),

            /**
             * эмитится из компонента question
             */
            drag ({offsetX, offsetY}, questionId) {
                this.currentQuestion = questionId;

                this.dragOffsetX = offsetX - this.square.x;
                this.dragOffsetY = offsetY - this.square.y;

                this.$refs.dynamicLine.addEventListener('mousemove', this.move);
                this.$refs.dynamicLine.addEventListener('mouseup', this.drop);
            },

            /**
             * вызывается в методе drag
             */
            move ({offsetX, offsetY}) {
                this.pathCoords = `M ${this.dragOffsetX - offsetX} ${this.dragOffsetY - offsetY} L 0 0`;
                this.stylesCoords = `translate(${offsetX}, ${offsetY})`;
            },

            /**
             * метод вызывается на событии mouseup
             * которое повешено на элемент this.$refs.dynamicLine
             * в методе drag
             */
            drop ({offsetX, offsetY}) {
                this.newAnswerCoords = {
                    x: offsetX - this.square.x,
                    y: offsetY - this.square.y
                };

                this.dragOffsetX = this.dragOffsetY = null;
                this.dragEnd();
                this.$refs.dynamicLine.removeEventListener('mousemove', this.move);
            },

            /**
             * вызовет модалку для создания ответа
             * в событии drop
             */
            dragEnd () {
                this.selectCreateAnswer();
            },

            /**
             * Вызывает модальное окно создания ответа
             *
             * @param id
             */
            selectCreateAnswer () {
                this.updateCreatingUpdatingState('creatingAnswer');
            },

            /**
             * Вызывает модальное окно изменения вопроса
             *
             * @param id
             */
            selectEditQuestion (id) {
                this.currentQuestion = id;
                this.updateCreatingUpdatingState('editingQuestion');
            },

            /**
             * Вызывает модальное окно изменения ответа
             *
             * @param id
             */
            selectEditAnswer (id) {
                this.currentAnswer = id;
                this.updateCreatingUpdatingState('editingAnswer');
            },

            /**
             * Закрывает модальные окна
             */
            closeAllModal () {
                for (let state in this.CreatingUpdatingState) {
                    this.CreatingUpdatingState[state] = false;
                }
            },

            /**
             * Сохраняет координаты двойного клика в this.newQuestionCoords
             * и передает их в компонент создания вопроса
             * вызывает модальное окно создания вопроса
             *
             * @param e {MouseEvent}
             */
            createQuestion ({offsetX, offsetY}) {
                this.newQuestionCoords = {
                    x: offsetX - this.square.x,
                    y: offsetY - this.square.y,
                };

                this.updateCreatingUpdatingState('creatingQuestion');
            },

            /**
             * Изменяет состояние CreatingUpdatingState имеющее 4 поля:
             *
             * creatingQuestion - сейчас видно модальное окно создания вопроса
             * creatingAnswer - сейчас видно модальное окно создания ответа
             *
             * editingQuestion - сейчас видно модальное окно изменения вопроса
             * editingAnswer - сейчас видно модальное окно изменения ответа
             *
             * @param activePopup
             */
            updateCreatingUpdatingState (activePopup) {
                for (let state in this.CreatingUpdatingState) {
                    if (state == activePopup) {
                        this.CreatingUpdatingState[state] = true;
                    } else {
                        this.CreatingUpdatingState[state] = false;
                    }
                }
            }
        },
        watch: {
            /**
             * работает ли if я незнаю.
             * идея в обновлении данных
             * но без if дофига запросов в базу
             * todo: разобраться с этим
             */
            questionsInCurrentScript (val) {
                if (val !== this.questionsInCurrentScript) {
                    this.$store.dispatch('setQuestionsInCurrentScript');
                }
            }
        },
    }
</script>

<style>
    .edit-script {
        position: fixed;
        top: 150px;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
