<template>
    <div class="question_with_answer">
        <div
            v-drag="{}"
            class="question_drag"
            :style="stylesCoords"
        >
            <div
                class="question"
                @click="selectQuestion"
                v-bind:id="question.id"
            >
                {{ question.name }} (ID: {{ question.id }})
            </div>

            <div
                class="question"
                @click="editQuestion"
            >edit</div>

            <div
                class="question"
                @click="addAnswer"
            >add</div>

            <div
                class="question"
                @click="deleteQ"
            >delete</div>
        </div>

        <answer
            v-for="answer in answers"
            :answer="answer"
            :key="answer.id"
            @click-edit-answer="selectAnswer(answer.id)"
        />
    </div>
</template>

<script>
    import Answer from '@/components/EditScript/answer/index.vue';
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: "question",
        props: ['question', 'currentQuestion'],
        data: () => ({
            stylesCoords: '',
            answers: [],
            editAnswer: false,
            currentAnswer: 0
        }),
        components: {
            Answer
        },
        async mounted () {
            this.setAnswers();

            if (this.question.coords) {
                this.stylesCoords = 'left: ' + this.question.coords.x + 'px; top: ' + this.question.coords.y + 'px;';
            }
        },
        computed: {
            ...mapGetters([
                'currentScriptId'
            ])
        },
        methods: {
            ...mapActions([
                'getAnswerById',
                'updateQuestion',
                'deleteQuestion'
            ]),
            async setAnswers () {
                let answer = {};

                if (typeof this.question.asnwers != 'undefined') {
                    for (let answerId of this.question.asnwers) {
                        answer = await this.getAnswerById(answerId);
                        this.answers.push(answer.data[0]);
                    }
                }
            },
            editQuestion () {
                this.$emit('click-edit-question');
            },
            async selectQuestion (e) {
                const coords = {
                    x: parseInt(e.target.parentNode.style.left, 10),
                    y: parseInt(e.target.parentNode.style.top, 10),
                };

                try {
                    await this.updateQuestion({
                        id: e.target.id,
                        data: {
                            coords: coords
                        }
                    });
                } catch (e) {
                    console.error(e);
                }
            },
            addAnswer () {
                this.$emit('click-question');
                this.$emit('is-add-answer');
            },
            selectAnswer (id) {
                this.$emit('click-answer', id);
            },
            deleteQ () {
                let answer = confirm('Все связанные сущности будут удалены. Продолжить?');

                if (answer) {
                    this.deleteQuestion({
                        questionId: this.question.id,
                        scriptId: this.currentScriptId
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
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

    #svg {
        position: fixed;
        width: 100%;
        height: 100%;
    }

    .handle {
        fill: dodgerblue;
    }

    .path {
        fill: none;
        stroke: dodgerblue;
        stroke-width: 6;
    }
</style>
