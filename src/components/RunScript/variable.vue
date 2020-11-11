<template>
    <div class="variable">
        {{ variable.name }}

        <input
            type="text"
            v-model="value"
            @input="saveValue"
        />
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { saveVariableValue, getVariablesByRunningScriptId } from '@/functions/forVariables.js';

    export default {
        name: "variable",
        props: ['variable', 'runningScriptId'],
        data: () => ({
            value: ''
        }),
        methods: {
            ...mapActions([
                'setValuesOfVariableInRunningScript'
            ]),
            async saveValue () {
                try {
                    await saveVariableValue(this.variable.id, this.runningScriptId, this.value);
                    const variables = await getVariablesByRunningScriptId(this.runningScriptId);
                    this.$store.dispatch('setValuesOfVariableInRunningScript', variables);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
</script>
