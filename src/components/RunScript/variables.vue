<template>
    <div class="variables">
        <h4>Переменные (просто пиши и они сохраняться)</h4>

        <variable
            v-for="variable in variablesInCurrentScript"
            :key="variable.id"
            :variable="variable"
            :runningScriptId="runningScriptId"
        />
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Variable from '@/components/RunScript/variable.vue';

    export default {
        name: "variables",
        components: {
            Variable
        },
        props: ['runningScriptId'],
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

<style>
    .variables {
        margin-top: 50px;
    }
</style>