<template>
    <div class="edit_question">
        <h3>Редактирование статуса ответа</h3>

        <form
            id="edit_status_form"
            @submit.prevent="submitStatus"
        >
            <div class="form-group">
                <label for="text">
                    Текст статуса
                </label>
                <textarea
                    class="form-control"
                    id="text"
                    name="text"
                    v-model="text"
                ></textarea>
            </div>

            <input
                type="submit"
                value="Сохранить"
                class="btn btn-primary"
            >
        </form>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import serializeFormByDomSelector from '@/functions/serializeFormByDomSelector.js';
    import { getAnswerStatusById } from '@/functions/getStuffById.js';

    export default {
        name: "editStatus",
        props: ['currentId'],
        data: () => ({
            text: ''
        }),
        watch: {
            currentId: function () {
                this.setStatusData();
            }
        },
        mounted () {
            this.setStatusData();
        },
        methods: {
            ...mapActions([
                'updateAnswerStatus'
            ]),
            async submitStatus () {
                let objFormData = serializeFormByDomSelector('#edit_status_form');

                await this.updateAnswerStatus({id: this.currentId, data: objFormData});
            },
            async setStatusData () {
                let answer = await getAnswerStatusById(this.currentId);
                this.text = answer.data[0].text;
            }
        }
    }
</script>
