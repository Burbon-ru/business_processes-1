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
    import delay from '@/functions/delay.js';
    import { saveVariableValue } from '@/functions/forVariables.js';

    export default {
        name: "variable",
        props: ['variable', 'runningScriptId'],
        data: () => ({
            value: ''
        }),
        methods: {
            async saveValue () {
                await delay(1);
                await saveVariableValue(this.variable.id, this.runningScriptId, this.value);
            }
        }
    }
</script>
