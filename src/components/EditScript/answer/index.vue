<template>
    <g
        class="answer_drag"
        :transform="stylesCoords"
        :id="answer.id"
        ref="box"
        @mousedown="drag"
        @mouseup="drop"
        @click="selectAnswer"
    >
        <defs>
            <marker id="arrow"  markerWidth="20" markerHeight="20" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#4294ff"/>
            </marker>
        </defs>

        <path
            :d="pathCoords"
            fill="transparent"
            stroke="#4294ff"
            stroke-width="1"
            marker-end="url(#arrow)"
        />

        <rect
            class="answer"
            width="200"
            height="40"
            fill="#fff"
            :stroke="blockColor"
            stroke-width="2"
        />

        <text
            x="20" y="24"
            fill="#000"
        >
            {{ answer.name }}
        </text>

        <circle
            cy="0" cx="200" r="10"
            stroke="#f58d0f"
            stroke-width="2"
            fill="white"
            @click="editAnswer"
        />
        <path
            d="M206.68,11.07l-2-2,4.83-4.83,2,2Zm-2.19-1.65,1.83,1.83-2.74.92Zm7.63-3.8-.35.35-2-2,.35-.35a.89.89,0,0,1,1.26,0l.74.74A.89.89,0,0,1,212.12,5.62Z"
            width="80" height="80" x="200"
            transform="translate(-70 -10) scale(1.3)"
            fill="#4294ff"
            class="answer"
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
            @click="deleteA"
        />
    </g>
</template>

<script>
    import {mapActions} from "vuex";

    import { bus } from '@/bus/index.js';

    import { getQuestionById, getAnswerById, getAnswerStatusById } from '@/functions/getStuffById.js';

    export default {
        name: "answer",
        props: ['answerId', 'currentQuestion'],
        data: () => ({
            currentAnswer: 0,
            answer: {},
            question: {},
            stylesCoords: '',
            pathCoords: '',
            square: {
                x: 25,
                y: 25
            },
            dragOffsetX: null,
            dragOffsetY: null,
            blockColor: ''
        }),
        async mounted () {
            this.answer = await getAnswerById(this.answerId);
            this.answer = this.answer.data[0];

            if (this.answer.status) {
                const answerStatus = await getAnswerStatusById(this.answer.status);
                this.blockColor = answerStatus.data[0].color;
            }

            if (this.answer.bind_to) {
                this.question = await getQuestionById(this.answer.bind_to);
                this.question = this.question.data[0];
            }

            if (this.question.coords) {
                this.pathCoords = `M 0 0 L ${this.question.coords.x - this.answer.coords.x} ${this.question.coords.y - this.answer.coords.y}`;
            }

            if (this.answer.coords) {
                this.stylesCoords =  `translate(${this.answer.coords.x}, ${this.answer.coords.y})`;
            }

            bus.$on('question-move', this.questionMoveHandler);
        },
        methods: {
            ...mapActions([
                'updateAnswer'
            ]),
            async selectAnswer (e) {
                try {
                    let updatedAnswer = await this.updateAnswer({
                        id: this.answer.id,
                        data: {
                            coords: {
                                x: e.offsetX - this.square.x,
                                y: e.offsetY - this.square.y,
                            }
                        }
                    });

                    this.answer = updatedAnswer.data;
                    this.$emit('answer-change');
                } catch (e) {
                    console.error(e);
                }
            },
            editAnswer () {
                this.$emit('click-edit-answer', this.answer.id);
            },
            deleteA () {
                console.log('delete answer');
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
                for (let key in this.$parent.pathsCoords) {
                    if (this.answerId == this.$parent.pathsCoords[key].id) {
                        this.$parent.pathsCoords[key].value = `M ${this.$parent.question.coords.x} ${this.$parent.question.coords.y} L ${offsetX - this.square.x} ${offsetY - this.square.y}`;
                    }
                }

                if (this.question.coords) {
                    this.pathCoords = `M 0 0 L ${this.question.coords.x - offsetX + this.square.x} ${this.question.coords.y - offsetY + this.square.y}`;
                }

                this.stylesCoords = `translate(${offsetX - this.square.x}, ${offsetY - this.square.x})`;
            },
            questionMoveHandler ({questionId, coords}) {
                if (this.answer.bind_to == questionId) {
                    this.pathCoords = `M 0 0 L ${coords.x - this.answer.coords.x} ${coords.y - this.answer.coords.y}`;
                }
            }
        }
    }
</script>

<style lang="scss">
    .answer_drag {
        display: inline-block;
        cursor: grab;
    }

    .answer {
        border: 1px solid black;
        display: inline-block;
        padding: 10px;

        &.selected {
            background-color: aqua;
        }
    }
</style>