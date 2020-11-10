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
        <path
            :d="pathCoords"
            fill="transparent"
            stroke="blue"
            stroke-width="5"
        />

        <rect
            class="answer"
            width="200"
            height="80"
            fill="orange"
        />

        <text
            x="20" y="20"
            fill="white"
        >
            {{ answer.name }}
        </text>

        <rect
            width="80"
            height="80"
            fill="grey"
            x="200"
            class="answer"
            @click="editAnswer"
        />
    </g>
</template>

<script>
    import {mapActions} from "vuex";
    import { getQuestionById, getAnswerById } from '@/functions/getStuffById.js';

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
                x: 50,
                y: 50,
            },
            dragOffsetX: null,
            dragOffsetY: null
        }),
        async mounted () {
            this.answer = await getAnswerById(this.answerId);
            this.answer = this.answer.data[0];

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
            }
        }
    }
</script>

<style lang="scss">
    .answer_drag {
        display: inline-block;
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