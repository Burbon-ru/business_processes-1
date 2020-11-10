<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Редактирование ответа</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" @click="closeModal">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-if="editIsDone">
                                Вопрос успешно отредактирован
                            </div>

                            <form
                                v-if="!editIsDone"
                                id="edit_answer_form"
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

                                <editor
                                    v-if="text.length"
                                    :initialValue="text"
                                    :language="editorOptions.language"
                                    :initialEditType="editorOptions.initialEditType"
                                    height="350px"
                                    ref="toastuiEditor"
                                />

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
    import { getAnswerById } from '@/functions/getStuffById.js';

    import { Editor } from '@toast-ui/vue-editor';
    import editorOptions from "@/settings/editorOptions";

    export default {
        name: "editAnswer",
        props: ['current', 'currentQuestion'],
        computed: {
            ...mapGetters([
                'answerStatusesList',
                'questionsInCurrentScript'
            ])
        },
        data: () => ({
            status: 0,
            text: '',
            name: '',
            bindTo: 0,
            editIsDone: false,
            editorOptions: editorOptions
        }),
        components: {
            Editor
        },
        watch: {
            current: function () {
                this.setAnswerData();
            }
        },
        methods: {
            ...mapActions([
                'updateAnswer'
            ]),
            closeModal () {
                this.$emit('close-modal');
            },
            getHtml() {
                return this.$refs.toastuiEditor.invoke('getHtml');
            },
            async submitAnswer () {
                let objFormData = serializeFormByDomSelector('#edit_answer_form');
                objFormData.text = this.getHtml();

                let updatedAnswer = await this.updateAnswer({id: this.current, data: objFormData});

                if (updatedAnswer.status == 200) {
                    this.editIsDone = true;
                }
            },
            async setAnswerData () {
                const answer = await getAnswerById(this.current);

                this.name = answer.data[0].name;
                this.text = answer.data[0].text;
                this.status = answer.data[0].status;
                this.bindTo = answer.data[0].bind_to;
            }
        },
        mounted () {
            this.$store.dispatch('getAnswerStatuses');
            this.setAnswerData();
        }
    }
</script>
