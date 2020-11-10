<template>
    <div class="variable">
        {{ variable.name }}

        <input
            type="text"
            v-model="value"
            @change="saveValue"
        />
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import delay from '@/functions/delay.js';

    export default {
        name: "variable",
        props: ['variable'],
        data: () => ({
            value: ''
        }),
        methods: {
            ...mapActions([
                'updateVariable'
            ]),
            async saveValue () {
                await delay(2);
                await this.updateVariable({id: this.variable.id, data: {value: this.value}});
            }
        }
    }
</script>
