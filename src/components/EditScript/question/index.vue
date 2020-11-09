<template>
    <g class="q_a_wrapper">
        <path
            v-for="(pathCoords, key) in pathsCoords"
            :key="key"
            :d="pathCoords.value"
            fill="transparent"
            stroke="black"
            stroke-width="5"
        />

        <g
            class="question_with_answer"
            :id="question.id"
            :transform="stylesCoords"
            ref="box"
            :style="cursor"
            @mousedown="drag"
            @mouseup="drop"
            @click="selectQuestion"
        >
            <rect
                class="question"
                :id="question.id"
                :class="{ selected: question.id == currentQuestion }"
                width="200"
                height="80"
                fill="gray"
            />

            <text
                fill="white"
                y="45" x="30"
            >
                {{ question.name }} (ID: {{ question.id }})
            </text>

            <rect
                y="0" x="200"
                style="fill: blue"
                width="80"
                height="80"
                class="question"
                @click="editQuestion"
            />

            <rect
                y="0" x="280"
                style="fill: greenyellow"
                width="80"
                height="80"
                class="question"
                @click="addAnswer"
            />

            <rect
                y="0" x="360"
                style="fill: red"
                width="80"
                height="80"
                class="question"
                @click="deleteQ"
            />
        </g>

        <answer
            v-for="answer in answers"
            :answerId="answer.id"
            :key="answer.id"
            @click-edit-answer="selectAnswer(answer.id)"
            @answer-change="changeAnswers"
        />
    </g>
</template>

<script>
    import Answer from '@/components/EditScript/answer/index.vue';
    import {mapActions, mapGetters} from 'vuex';
    export default {
        name: "question",
        props: ['currentQuestion', 'questionId'],
        data: () => ({
            stylesCoords: '',
            pathsCoords: [],
            answers: [],
            question: {},
            editAnswer: false,
            currentAnswer: 0,
            square: {
                x: 50,
                y: 50,
            },
            dragOffsetX: null,
            dragOffsetY: null,
            x: null,
            y: null
        }),
        components: {
            Answer
        },
        async mounted () {
            this.question = await this.getQuestionById(this.questionId);
            this.question = this.question.data[0];
            this.answers = await this.getAnswersOfQuestionById(this.questionId);
            for (let answer of this.answers) {
                this.pathsCoords.push({
                    id: answer.id,
                    value: `M ${this.question.coords.x} ${this.question.coords.y} L ${answer.coords.x} ${answer.coords.y}`
                });
            }
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
                'getQuestionById',
                'getAnswerById',
                'updateQuestion',
                'getAnswersOfQuestionById',
                'deleteQuestion'
            ]),
            editQuestion () {
                this.$emit('click-edit-question');
            },
            async changeAnswers () {
                this.answers = await this.getAnswersOfQuestionById(this.questionId);
            },
            async selectQuestion (e) {
                try {
                    let updatedQuestion = await this.updateQuestion({
                        id: e.target.id,
                        data: {
                            coords: {
                                x: e.offsetX - this.square.x,
                                y: e.offsetY - this.square.y
                            }
                        }
                    });
                    this.question = updatedQuestion.data;
                } catch (e) {
                    console.error(e);
                }
            },
            deleteQ () {
                let answer = confirm('Все связанные сущности будут удалены. Продолжить?');
                if (answer) {
                    this.deleteQuestion({
                        questionId: this.question.id,
                        scriptId: this.currentScriptId
                    });
                }
            },
            addAnswer () {
                this.$emit('click-question');
                this.$emit('is-add-answer');
            },
            selectAnswer (id) {
                this.$emit('click-answer', id);
            },
            drag ({offsetX, offsetY}) {
                this.dragOffsetX = offsetX - this.square.x;
                this.dragOffsetY = offsetY - this.square.y;
                this.$refs.box.addEventListener('mousemove', this.move);
            },
            drop () {
                this.dragOffsetX = this.dragOffsetY = null;
                this.$refs.box.removeEventListener('mousemove', this.move);
            },
            move ({offsetX, offsetY}) {
                for (let answer of this.answers) {
                    for (let pathKey in this.pathsCoords) {
                        if (this.pathsCoords[pathKey].id == answer.id) {
                            this.pathsCoords[pathKey].value = `M ${offsetX} ${offsetY} L ${answer.coords.x} ${answer.coords.y}`;
                        }
                    }
                }
                this.stylesCoords = `translate(${offsetX - this.square.x}, ${offsetY - this.square.y})`;
            }
        }
    }
</script>

<style lang="scss">
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