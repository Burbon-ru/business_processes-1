<template>
    <div class="variables__list">
        <div
            v-for="variable in variablesInCurrentScript"
            :key="variable.id"
        >
            {{ variable.name }}
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: "list",
        methods: {
            ...mapActions([
                'setVariablesInCurrentScript'
            ])
        },
        computed: {
            ...mapGetters([
                'currentScriptId',
                'variablesInCurrentScript'
            ])
        },
        mounted () {
            this.$store.dispatch('setCurrentScriptId', this.$route.params.id);
            this.$store.dispatch('setVariablesInCurrentScript');
        },
    }
</script>
