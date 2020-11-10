<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Редактирование переменной</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" @click="closeModal">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-if="updateIsDone">
                                Переменная успешно отредактирована
                            </div>

                            <form
                                v-if="!updateIsDone"
                                id="update_variable_form"
                                @submit.prevent="submitVariables"
                            >
                                <div class="form-group">
                                    <label for="name">
                                        Название переменной
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="name"
                                        name="name"
                                        v-model="name"
                                    >
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
    import { getVariableById } from '@/functions/getStuffById.js';

    export default {
        name: "editVariable",
        props: ['currentId'],
        data: () => ({
            name: '',
            updateIsDone: false
        }),
        mounted () {
            this.setQuestionData();
        },
        computed: {
            ...mapGetters([
                'variablesInCurrentScript',
                'currentScriptId'
            ])
        },
        methods: {
            ...mapActions([
                'updateVariable'
            ]),
            closeModal () {
                this.$emit('close-modal');
            },
            async setQuestionData () {
                const variable = await getVariableById(this.currentId);

                this.name = variable.data[0].name;
            },
            async submitVariables () {
                let objFormData = serializeFormByDomSelector('#update_variable_form');

                let createdVariable = await this.updateVariable({id: this.currentId, data: objFormData});

                if (createdVariable.status == 200) {
                    this.updateIsDone = true;
                }
            }
        }
    }
</script>
