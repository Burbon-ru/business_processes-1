<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Создание ответа</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" @click="closeModal">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-if="createIsDone">
                                Ответ успешно создан
                            </div>

                            <form
                                v-if="!createIsDone"
                                id="create_answer_form"
                                @submit.prevent="submitAnswer"
                            >
                                <div class="form-group">
                                    <label for="name">
                                        Название ответа
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="name"
                                        name="name"
                                        v-model="name"
                                    >
                                </div>

                                <div class="form-group">
                                    <label for="status">
                                        Статус
                                    </label>

                                    <select
                                        v-model="status"
                                        id="status"
                                        name="status"
                                        class="form-control"
                                    >
                                        <option
                                            v-for="status in answerStatusesList"
                                            :value="status.id"
                                            :key="status.id"
                                        >
                                            {{ status.text }}
                                        </option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="bind_to">
                                        Привязать к вопросу (по id)
                                    </label>

                                    <select
                                        v-model="bindTo"
                                        id="bind_to"
                                        name="bind_to"
                                        class="form-control"
                                    >
                                        <option
                                            v-for="question in questionsInCurrentScript"
                                            :value="question.id"
                                            :key="question.id"
                                        >
                                            {{ question.id }}
                                        </option>
                                    </select>
                                </div>

                                <input
                                    type="submit"
                                    value="Сохранить"
                                    class="btn btn-primary"
                                >
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import serializeFormByDomSelector from '@/functions/serializeFormByDomSelector.js';
    import {getQuestionById} from '@/functions/getStuffById.js';

    export default {
        name: "createAnswer",
        props: ['currentQuestion'],
        data: () => ({
            status: 0,
            name: '',
            bindTo: 0,
            createIsDone: false
        }),
        computed: {
            ...mapGetters([
                'answerStatusesList',
                'questionsInCurrentScript'
            ])
        },
        mounted () {
            this.$store.dispatch('getAnswerStatuses');
        },
        methods: {
            ...mapActions([
                'getAnswerStatuses',
                'createAnswer',
                'updateQuestion'
            ]),
            closeModal () {
                this.$emit('close-modal');
            },
            async submitAnswer () {
                let objFormData = serializeFormByDomSelector('#create_answer_form');

                let createdAnswer = await this.createAnswer(objFormData);
                let updatedQuestion = await getQuestionById(this.currentQuestion);

                let answers = updatedQuestion.data[0].answers;

                answers.push(createdAnswer.data.id);
                let updateQuestion = await this.updateQuestion({id: this.currentQuestion, data: {answers: answers}});

                if (updateQuestion.status == 200) {
                    this.createIsDone = true;
                }
            }
        }
    }
</script>
