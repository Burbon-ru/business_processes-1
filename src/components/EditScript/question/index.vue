<template>
    <g
        class="q_a_wrapper"
        @mousedown="addDragOnWrapper"
        @mouseup="addDropOnWrapper"
        ref="addWr"
    >
        <defs>
            <marker
                id="arrow"
                markerWidth="20" markerHeight="20"
                refX="10" refY="3"
                orient="auto"
                markerUnits="strokeWidth"
            >
                <path d="M0,0 L0,6 L9,3 z" fill="#4294ff"/>
            </marker>
        </defs>

        <!-- Пути от вопроса к ответам -->
        <path
            v-for="(pathCoords, key) in pathsCoords"
            :key="key"
            :d="pathCoords.value"
            fill="transparent"
            stroke="#4294ff"
            stroke-width="1"
            marker-end="url(#arrow)"
        />

        <g
            @mousedown="addDrag"
            @mouseup="addDrop"
        >
            <circle
                cy="40" cx="100" r="10"
                stroke="#cfcfcf"
                stroke-width="1"
                fill="#fff"
            />
            <path
                d="M108.66,48.66h2.57a.51.51,0,0,0,.51-.51v-.34a.51.51,0,0,0-.51-.52h-2.57V44.73a.51.51,0,0,0-.51-.52h-.34a.52.52,0,0,0-.52.52v2.56h-2.56a.52.52,0,0,0-.52.52v.34a.51.51,0,0,0,.52.51h2.56v2.57a.51.51,0,0,0,.52.51h.34a.51.51,0,0,0,.51-.51Z"
                y="0" x="280"
                transform="translate(-40 -22) scale(1.3)"
                style="fill: #2f700f"
                width="80"
                height="80"
                class="question add-answer"
            />
        </g>

        <!--
        Группа:
        прямоугольник, текст в нем,
        иконки:
            добавления ответа,
            редактирования вопроса,
            удаления вопроса и связанных с ним ответов
        -->
        <g
            class="question_with_answer"
            :id="question.id"
            :transform="stylesCoords"
            ref="box"
            :style="cursor"
        >
            <g
                @mousedown="drag"
                @mouseup="drop"
            >
                <rect
                    class="question"
                    :id="question.id"
                    width="200"
                    height="40"
                    fill="#fff"
                    stroke="#cfcfcf"
                    stroke-width="1"
                />

                <text
                    fill="#000"
                    y="24" x="30"
                >
                    {{ question.name }} (ID: {{ question.id }})
                </text>
            </g>

            <path
                :d="newPathCoord"
                fill="transparent"
                stroke="#4294ff"
                stroke-width="1"
                marker-end="url(#arrow)"
            />

            <circle
                cy="0" cx="200" r="10"
                stroke="#cfcfcf"
                stroke-width="1"
                fill="#fff"
            />
            <path
                d="M206.68,11.07l-2-2,4.83-4.83,2,2Zm-2.19-1.65,1.83,1.83-2.74.92Zm7.63-3.8-.35.35-2-2,.35-.35a.89.89,0,0,1,1.26,0l.74.74A.89.89,0,0,1,212.12,5.62Z"
                y="0" x="200"
                transform="translate(-70 -10) scale(1.3)"
                style="fill: #4294ff"
                width="80"
                height="80"
                class="question edit-question"
                @click="editQuestion"
            />

            <circle
                cy="0" cx="0" r="10"
                stroke="#cfcfcf"
                stroke-width="1"
                fill="#fff"
            />
            <path
                d="M9,8l1.81-1.82a.51.51,0,0,0,0-.72l-.24-.24a.52.52,0,0,0-.73,0L8,7,6.16,5.2a.49.49,0,0,0-.72,0l-.24.24a.49.49,0,0,0,0,.72L7,8,5.2,9.79a.52.52,0,0,0,0,.73l.24.24a.51.51,0,0,0,.72,0L8,9l1.81,1.81a.52.52,0,0,0,.73,0l.24-.24a.52.52,0,0,0,0-.73Z"
                y="0" x="360"
                transform="translate(-12 -12) scale(1.5)"
                style="fill: #f00;"
                width="80"
                height="80"
                class="question delete"
                @click="deleteQ"
            />
        </g>

        <answer
            v-for="answer in answers"
            :answerId="answer.id"
            :key="answer.id"
            @click-answer-edit="clickEditAnswer(answer.id)"
            @answer-change="changeAnswers"
        />
    </g>
</template>

<script>
    import Answer from '@/components/EditScript/answer/index.vue';
    import {mapActions, mapGetters} from 'vuex';

    import { bus } from '@/bus/index.js';

    import { getQuestionById, getAnswersOfQuestionById } from '@/functions/getStuffById.js';

    export default {
        name: "question",
        props: ['questionId'],
        data: () => ({
            stylesCoords: '',
            pathsCoords: [],
            newPathCoord: '',
            answers: [],
            question: {},
            editAnswer: false,
            currentAnswer: 0,
            square: {
                x: 75,
                y: 25,
            },
            dragOffsetX: null,
            dragOffsetY: null,
            x: null,
            y: null
        }),
        components: {
            Answer
        },

        /**
         * получаю вопрос - присваиваю this.question
         * получаю ответы вопроса - присваиваю this.answers
         * создаю линии ко всем ответам - в this.pathsCoords
         */
        async mounted () {
            this.question = await getQuestionById(this.questionId);
            this.question = this.question.data[0];

            this.answers = await getAnswersOfQuestionById(this.questionId);

            for (let answer of this.answers) {
                this.pathsCoords.push({
                    id: answer.id,
                    value: `M ${this.question.coords.x} ${this.question.coords.y} L ${answer.coords.x} ${answer.coords.y}`
                });
            }

            this.newPathCoord = `M 0 0 L 0 0`;

            if (this.question.coords) {
                this.stylesCoords = `translate(${this.question.coords.x}, ${this.question.coords.y})`;
            }
        },
        computed: {
            ...mapGetters([
                'currentScriptId'
            ]),
            cursor () {
                return `cursor: ${this.dragOffsetX ? 'grabbing' : 'grab'}, `;
            }
        },
        methods: {
            ...mapActions([
                'updateQuestion',
                'deleteQuestion'
            ]),

            /**
             * в дальнейшем не понадобится
             * сейчас говорит родительскому компоненту чтобы вызвал модальное окно добавления ответа
             * заберу тело функции (this.$emit('click-answer-add');)
             */
            // addAnswer () {
            //     this.$emit('click-answer-add');
            // },

            /**
             * Говорит родительскому компоненту чтобы он вызвал редактирование ответа
             * срабатывает по событию click-answer-edit вызываемое из компонента answer
             */
            clickEditAnswer (id) {
                this.$emit('click-answer-edit', id);
            },

            /**
             * Говорит родительскому компоненту чтобы он вызвал редактирование вопроса
             *
             */
            editQuestion () {
                this.$emit('click-question-edit');
            },

            /**
             * Событие вызывается из компонента answer
             * чтобы обновить данные о ответах здесь:
             * перерисовать линии
             * todo: чтобы конкретный ответ обовлялся а не все
             *
             * @returns {Promise<void>}
             */
            async changeAnswers () {
                this.answers = await getAnswersOfQuestionById(this.questionId);
            },

            /**
             * Удаление вопроса
             */
            deleteQ () {
                if (confirm('Все связанные сущности будут удалены. Продолжить?')) {
                    this.deleteQuestion({
                        questionId: this.question.id,
                        scriptId: this.currentScriptId
                    });
                }
            },

            /**
             * Событие завершения перетаскивания
             * Метод сохраняет значения координат вопроса в базу,
             * обновляет данные this.question,
             * и по шине событий передает событие question-move с данными:
             * questionId - id вопроса который передвинут
             * coords - новые координаты вопроса
             * что перерисовать линию от ответа к привязанному к нему вопросу
             * в компоненте answer
             *
             * вызывается в событии drop
             */
            async dragEnd (e) {
                try {
                    const coords = {
                        x: e.offsetX - this.square.x,
                        y: e.offsetY - this.square.y
                    };

                    let updatedQuestion = await this.updateQuestion({
                        id: this.question.id,
                        data: {
                            coords: coords
                        }
                    });

                    this.question = updatedQuestion.data;

                    bus.$emit('question-move', {questionId: this.question.id, coords: coords});
                } catch (e) {
                    console.error(e);
                }
            },

            /**
             * перерисовывает пути ко всем ответам
             * вызывается в методах drag and drop
             *
             * @param offsetX
             * @param offsetY
             */
            move ({offsetX, offsetY}) {
                for (let answer of this.answers) {
                    this.pathsCoords = this.pathsCoords.map(el => {
                        el.value = `M ${offsetX} ${offsetY} L ${answer.coords.x} ${answer.coords.y}`;
                        return el;
                    });
                }

                this.stylesCoords = `translate(${offsetX - this.square.x}, ${offsetY - this.square.y})`;
            },

            /**
             * drag на событии mousedown
             *
             * @param offsetX
             * @param offsetY
             */
            drag ({offsetX, offsetY}) {
                this.dragOffsetX = offsetX - this.square.x;
                this.dragOffsetY = offsetY - this.square.y;

                this.$refs.box.addEventListener('mousemove', this.move);
            },

            /**
             * drag на событии mouseup
             */
            drop (e) {
                this.dragOffsetX = this.dragOffsetY = null;

                this.dragEnd(e);

                this.$refs.box.removeEventListener('mousemove', this.move);
            },

            // for test
            addMove ({offsetX, offsetY}) {
                console.log({offsetX, offsetY});
                this.newPathCoord = `M ${offsetX} ${offsetY} L 0 0`;
            },

            addDrag ({offsetX, offsetY}) {
                this.dragOffsetX = offsetX - this.square.x;
                this.dragOffsetY = offsetY - this.square.y;

                this.$refs.add.addEventListener('mousemove', this.addMove);
            },

            addDrop (e) {
                console.log('addDrop', e);
                this.dragOffsetX = this.dragOffsetY = null;

                this.$refs.add.removeEventListener('mousemove', this.addMove);
            },

            addDragOnWrapper ({offsetX, offsetY}) {
                this.dragOffsetX = offsetX - this.square.x;
                this.dragOffsetY = offsetY - this.square.y;

                this.$refs.addWr.addEventListener('mousemove', this.addMove);
            },

            addDropOnWrapper (e) {
                console.log('addDrop', e);
                this.dragOffsetX = this.dragOffsetY = null;

                this.$refs.addWr.removeEventListener('mousemove', this.addMove);
            }
        }
    }
</script>

<style lang="scss">
    .edit-question, .delete, .add-answer, .edit-answer {
        cursor: pointer;
    }

    .question_with_answer {
        display: inline-block;
        cursor: grab;
    }

    .question {
        border: 1px solid black;
        display: inline-block;
        padding: 10px;

        &.selected {
            background-color: aqua;
        }
    }

    .question_drag {
        display: inline-block;
    }

    .handle {
        fill: dodgerblue;
    }
</style>
