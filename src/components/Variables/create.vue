<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Создание переменной</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" @click="closeModal">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-if="createIsDone">
                                Переменная успешно создана
                            </div>

                            <form
                                v-if="!createIsDone"
                                id="create_variable_form"
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
    import {getScriptById} from '@/functions/getStuffById.js';

    export default {
        name: "createVariable",
        data: () => ({
            name: '',
            createIsDone: false
        }),
        computed: {
            ...mapGetters([
                'variablesInCurrentScript',
                'currentScriptId'
            ])
        },
        methods: {
            ...mapActions([
                'createVariable',
                'updateScript'
            ]),
            closeModal () {
                this.$emit('close-modal');
            },
            async submitVariables () {
                let objFormData = serializeFormByDomSelector('#create_variable_form');

                let createdVariable = await this.createVariable(objFormData);
                let updatedScript = await getScriptById(this.currentScriptId);

                let variables = updatedScript.data[0].variables;
                variables.push(createdVariable.data.id);

                let updateScriptRes = await this.updateScript({id: this.currentScriptId, data: {variables: variables}});

                if (updateScriptRes.status == 200) {
                    this.createIsDone = true;
                }
            }
        }
    }
</script>
