<template>
    <div class="variables__list">
        <div
            v-for="variable in variablesInCurrentScript"
            :key="variable.id"
        >
            {{ variable.name }}

            <button
                @click="clickEdit(variable.id)"
                type="button"
            >
                edit
            </button>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: "variablesList",
        mounted () {
            this.$store.dispatch('setCurrentScriptId', this.$route.params.id);
            this.$store.dispatch('setVariablesInCurrentScript');
        },
        methods: {
            ...mapActions([
                'setVariablesInCurrentScript'
            ]),
            clickEdit (id) {
                this.$emit('click-edit-variable', id);
            }
        },
        computed: {
            ...mapGetters([
                'currentScriptId',
                'variablesInCurrentScript'
            ])
        }
    }
</script>
