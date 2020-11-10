<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Редактирование вопроса</h5>
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
                                id="edit_question_form"
                                @submit.prevent="submitQuestion"
                            >
                                <div class="form-group">
                                    <label for="name">
                                        Название вопроса
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
    import { getQuestionById } from '@/functions/getStuffById.js';

    import { Editor } from '@toast-ui/vue-editor';
    import editorOptions from "@/settings/editorOptions";

    export default {
        name: "editQuestion",
        props: ['current'],
        data: () => ({
            name: '',
            text: '',
            editIsDone: false,
            editorOptions: editorOptions
        }),
        components: {
            Editor
        },
        computed: {
            ...mapGetters([
                'questionsInCurrentScript'
            ])
        },
        mounted () {
            this.setQuestionData();
        },
        watch: {
            current: function () {
                this.setQuestionData();
            }
        },
        methods: {
            ...mapActions([
                'updateQuestion'
            ]),
            closeModal () {
                this.$emit('close-modal');
            },
            getHtml() {
                return this.$refs.toastuiEditor.invoke('getHtml');
            },
            async setQuestionData () {
                const question = await getQuestionById(this.current);

                this.name = question.data[0].name;
                this.text = question.data[0].text;
            },
            async submitQuestion () {
                let objFormData = serializeFormByDomSelector('#edit_question_form');
                objFormData.text = this.getHtml();

                let updatedQuestion = await this.updateQuestion({id: this.current, data: objFormData});

                if (updatedQuestion.status == 200) {
                    this.editIsDone = true;
                }
            }
        }
    }
</script>
