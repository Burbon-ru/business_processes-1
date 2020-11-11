<template>
    <div class="discussion">
        <div
            class="bubble sender first"
            v-html="question.text"
        ></div>

        <div
            v-if="answer"
            class="bubble recipient first"
            v-html="answer"
        ></div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getQuestionById } from '@/functions/getStuffById.js';

    export default {
        name: "messages",
        props: ['currentQuestion', 'answer', 'runningScriptId'],
        data: () => ({
            question: {}
        }),
        computed: {
            ...mapGetters([
                'valuesOfVariableInRunningScript'
            ])
        },
        watch: {
            valuesOfVariableInRunningScript (val) {
                const variables = JSON.parse(JSON.stringify(val));

                let ob = {};

                for (const variable of variables) {
                    ob[variable.id] = '{' + variable.value + '}';
                }

                this.setReplacedVariable(ob);
            }
        },
        async mounted () {
            let question = await getQuestionById(this.currentQuestion);
            this.question = question.data[0];

            const variables = JSON.parse(JSON.stringify(this.valuesOfVariableInRunningScript));
            let ob = {};
            for (const variable of variables) {
                ob[variable.id] = '{' + variable.value + '}';
            }
            this.setReplacedVariable(ob);
        },
        methods: {
            setReplacedVariable (ob) {
                const regex = /{(.*?)}/g;
                this.question.text = this.question.text.replace(regex, (m, c) => (ob)[c]);
            }
        }
    }
</script>

<style>
    .discussion {
        display: flex;
        flex-direction: column;
    }

    .discussion > .bubble {
        border-radius: 1em;
        padding: 0.25em 0.75em;
        margin: 1.0625em;
        max-width: 470px;
        min-width: 470px;
    }

    .discussion > .bubble.sender {
        align-self: flex-start;
        background-color: cornflowerblue;
        color: #fff;
    }

    .sender ol {
        text-align: left;
    }

    .discussion > .bubble.recipient {
        align-self: flex-end;
        background-color: #efefef;
    }

    .discussion > .bubble.sender.first { border-bottom-left-radius: 0.1em; }
    .discussion > .bubble.sender.last { border-top-left-radius: 0.1em; }
    .discussion > .bubble.sender.middle {
        border-bottom-left-radius: 0.1em;
        border-top-left-radius: 0.1em;
    }

    .discussion > .bubble.recipient.first { border-bottom-right-radius: 0.1em; }
    .discussion > .bubble.recipient.last { border-top-right-radius: 0.1em; }
    .discussion > .bubble.recipient.middle {
        border-bottom-right-radius: 0.1em;
        border-top-right-radius: 0.1em;
    }
</style>