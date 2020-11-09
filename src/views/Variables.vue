<template>
    <div class="variables">
        <button
            @click="selectCreateVariable('creating')"
        >
            Создать переменную
        </button>

        <create-variable
            v-if="CreatingUpdatingState.creating"
            @close-modal="closeAllModal"
        />

        <list />
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import List from '@/components/Variables/list.vue';
    import createVariable from '@/components/Variables/create.vue';

    export default {
        name: "Variables",
        components: {
            List,
            createVariable
        },
        mounted () {
            this.$store.dispatch('setCurrentScriptId', this.$route.params.id);
            this.$store.dispatch('setVariablesInCurrentScript');
        },
        data: () => ({
            CreatingUpdatingState: {
                creating: false,
                updating: false
            },
            isSaved: false
        }),
        methods: {
            ...mapActions([
                'getScriptById',
                'setCurrentScriptId',
                'setVariablesInCurrentScript'
            ]),
            selectCreateVariable () {
                this.updateCreatingUpdatingState('creating');
            },
            closeAllModal () {
                for (let state in this.CreatingUpdatingState) {
                    this.CreatingUpdatingState[state] = false;
                }
            },
            updateCreatingUpdatingState (changingNow) {
                for (let state in this.CreatingUpdatingState) {
                    if (state == changingNow) {
                        this.CreatingUpdatingState[state] = true;
                    } else {
                        this.CreatingUpdatingState[state] = false;
                    }
                }
            }
        }
    }
</script>
