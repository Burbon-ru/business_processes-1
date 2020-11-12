<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Создание вопроса</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" @click="closeModal">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-if="createIsDone">
                                Вопрос успешно создан
                            </div>

                            <form
                                v-if="!createIsDone"
                                id="create_question_form"
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
    import serializeFormByDomSelector from '@/functions/serializeFormByDomSelector.js';
    import delay from '@/functions/delay.js';

    import {mapActions, mapGetters} from 'vuex';

    import { Editor } from '@toast-ui/vue-editor';
    import editorOptions from "@/settings/editorOptions";

    export default {
        name: "createQuestion",
        data: () => ({
            text: '',
            name: '',
            createIsDone: false,
            editorOptions: editorOptions
        }),
        props: ['newQuestionCoords'],
        components: {
            Editor
        },
        computed: {
            ...mapGetters([
                'currentScriptId'
            ])
        },
        methods: {
            ...mapActions([
                'createAnswerStatus',
                'updateScript',
                'createQuestion'
            ]),
            closeModal () {
                this.$emit('close-modal');
            },
            getHtml() {
                return this.$refs.toastuiEditor.invoke('getHtml');
            },
            async submitQuestion () {
                let objFormData = serializeFormByDomSelector('#create_question_form');

                objFormData.text = this.getHtml();
                objFormData.answers = [];
                objFormData.coords = this.newQuestionCoords;

                let createdQuestion = await this.createQuestion({data: objFormData, scriptId: this.currentScriptId});

                if (createdQuestion) {
                    this.createIsDone = true;
                    await delay(2);
                    this.closeModal();
                }
            }
        }
    }
</script>
