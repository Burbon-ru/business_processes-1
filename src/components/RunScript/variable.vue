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
                await this.delay(2);
                await this.updateVariable({id: this.variable.id, data: {value: this.value}});
            },
            delay (s) {
                return new Promise((resolve => {
                    setTimeout(() => {
                        resolve();
                    }, s * 1000);
                }))
            }
        }
    }
</script>
