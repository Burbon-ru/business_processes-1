import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

import {
    getVariableById,
    getScriptById,
    getQuestionById
} from './../functions/getStuffById';

export default new Vuex.Store({
    state: {
        scripts: [],
        currentScriptId: 0,
        questions: [],

        /**
         * массив из полных объектов вопросов
         * думаю это должен быть массив id-шников
         * из EditScript в question передается только id
         * и в question я получаю все данные
         */
        questionsInCurrentScript: [],
        answers: [],
        answerStatuses: [],
        variables: [],
        variablesInCurrentScript: [],
        variableValuesInRunningScript: []
    },
    getters: {
        scriptsList (state) {
            return state.scripts;
        },
        variablesInCurrentScript (state) {
            return state.variablesInCurrentScript;
        },
        currentScriptId (state) {
            return state.currentScriptId;
        },
        questionsInCurrentScript (state) {
            return state.questionsInCurrentScript;
        },
        answersList (state) {
            return state.answers;
        },
        answerStatusesList (state) {
            return state.answerStatuses;
        },
        valuesOfVariableInRunningScript (state) {
            return state.variableValuesInRunningScript;
        }
    },
    mutations: {
        setScriptsList (state, scripts) {
            state.scripts = scripts;
        },
        addItemScripts (state, script) {
            state.scripts.push(script);
        },
        setVariablesList (state, variables) {
            state.variables = variables;
        },
        addItemVariables (state, variable) {
            state.variables.push(variable);
        },
        addQuestion (state, question) {
            state.questions.push(question);
        },
        setAnswerStatuses (state, answerStatuses) {
            state.answerStatuses = answerStatuses;
        },
        addAnswerStatus (state, status) {
            state.answerStatuses.push(status);
        },
        setAnswersList (state, answers) {
            state.answers = answers;
        },
        setCurrentScriptId (state, id) {
            state.currentScriptId = id;
        },
        setQuestionsInCurrentScriptInState (state, questions) {
            state.questionsInCurrentScript = questions;
        },
        addQuestionInCurrentScriptInState (state, question) {
            state.questionsInCurrentScript.push(question);
        },
        deleteQuestionInCurrentScriptInState (state, questionId) {
            state.questionsInCurrentScript = state.questionsInCurrentScript.filter(el => el.id != questionId);
        },
        setVariablesInCurrentScriptInState (state, variables) {
            state.variablesInCurrentScript = variables;
        },
        setValueOfVariableInRunningScriptInState (state, variables) {
            state.variableValuesInRunningScript = variables;
        }
    },
    actions: {
        /* creators */
        async createScript (context, name) {
            try {
                const scriptData = {
                    name: name,
                    questions: [],
                    variables: []
                };

                let script = await axios.post('http://localhost:3000/scripts', scriptData);

                context.commit('addItemScripts', script.data);
            } catch (error) {
                console.error(error);
                return error;
            }
        },
        async createQuestion (context, {data, scriptId}) {
            try {
                let question = await axios.post('http://localhost:3000/questions', data);
                let updatedScript = await getScriptById(scriptId);

                let questions = updatedScript.data[0].questions;
                questions.push(question.data.id);

                let updateScriptRes = await axios.patch('http://localhost:3000/scripts/' + scriptId, {questions: questions});

                if (200 == updateScriptRes.status) {
                    context.commit('addQuestion', question.data);
                    context.commit('addQuestionInCurrentScriptInState', question.data);

                    return true;
                }

                return false
            } catch (error) {
                console.error(error);
                return error;
            }
        },
        // todo: экшон должен делать еще и коммит
        async createAnswer (context, data) {
            return axios.post('http://localhost:3000/answers', data);
        },
        async createAnswerStatus (context, data) {
            try {
                let created = await axios.post('http://localhost:3000/answer_statuses', data);
                context.commit('addAnswerStatus', created.data);

                return created.status;
            } catch (error) {
                console.error(error);
                return error;
            }
        },
        async createVariable (context, {name}) {
            try {
                const VariableData = {name: name};
                let variable = await axios.post('http://localhost:3000/variables', VariableData);
                context.commit('addItemVariables', variable.data);

                return variable;
            } catch (error) {
                console.error(error);
                return error;
            }
        },

        /* getters */
        async getScripts (context) {
            try {
                const scripts = await axios.get('http://localhost:3000/scripts');
                context.commit('setScriptsList', scripts.data);
            } catch (error) {
                console.error(error);
                return error;
            }
        },
        async getAnswerStatuses (context) {
            try {
                const statuses = await axios.get('http://localhost:3000/answer_statuses');
                context.commit('setAnswerStatuses', statuses.data);
            } catch (error) {
                console.error(error);
                return error;
            }
        },
        async getAnswers (context) {
            try {
                const answers = await axios.get('http://localhost:3000/answers');
                context.commit('setAnswersList', answers.data);
            } catch (error) {
                console.error(error);
                return error;
            }
        },

        /* updaters */
        // todo: экшоны должены делать еще и коммит
        async updateScript (context, data) {
            return axios.patch('http://localhost:3000/scripts/' + data.id, data.data);
        },
        async updateQuestion (context, data) {
            return axios.patch('http://localhost:3000/questions/' + data.id, data.data);
        },
        async updateVariable (context, data) {
            return axios.patch('http://localhost:3000/variables/' + data.id, data.data);
        },
        async updateAnswer (context, data) {
            return axios.patch('http://localhost:3000/answers/' + data.id, data.data);
        },
        async updateAnswerStatus (context, data) {
            return axios.patch('http://localhost:3000/answer_statuses/' + data.id, data.data);
        },

        /* delete */
        // todo: это еще не конец (напиши метод удаления ответа и используй его здесь)
        async deleteQuestion (context, {questionId, scriptId}) {
            let script = await axios.get('http://localhost:3000/scripts/?id=' + scriptId);
            let questionDeleted = await axios.delete('http://localhost:3000/questions/' + questionId);

            if (200 == questionDeleted.status) {
                context.commit('deleteQuestionInCurrentScriptInState', questionId);

                let questionsBefore = script.data[0].questions;
                let questions = script.data[0].questions.filter(e => e !== questionId);
                let scriptUpdate = await axios.patch('http://localhost:3000/scripts/' + scriptId, {questions: questions});

                if (200 == scriptUpdate.status) {
                    let answers = questionsBefore.answers;
                    let successDeletedAnswers = true;

                    if (answers.length) {
                        let answersDeleteResult = {};

                        for (let answerId in answers) {
                            answersDeleteResult = await axios.delete('http://localhost:3000/answers/' + answerId);

                            if (200 !== answersDeleteResult) {
                                successDeletedAnswers = false;
                            }
                        }
                    }

                    if (successDeletedAnswers) {
                        return true;
                    }
                }
            }

            return false;
        },
        async deleteAnswer (context, {questionId, answerId}) {
            const res = await axios.delete('http://localhost:3000/answers/' + answerId);

            console.log('res in store', res);

            if (200 == res.status) {
                let question = await axios.get('http://localhost:3000/questions/?id=' + questionId);

                console.log('question', question);

                let answers = question.data[0].answers.filter(e => e !== answerId);
                let scriptUpdate = await axios.patch('http://localhost:3000/questions/' + questionId, {answers: answers});

                if (200 == scriptUpdate.status) {
                    return true;
                }
            }

            return false;
        },

        /* setters */
        setCurrentScriptId (context, id) {
            context.commit('setCurrentScriptId', id);
        },
        async setQuestionsInCurrentScript (context) {
            let script = await getScriptById(this.getters.currentScriptId);
            let curScript = script.data[0];

            let question = {};
            let questions = [];

            for (let questionId of curScript.questions) {
                question = await getQuestionById(questionId);
                questions.push(question.data[0]);
            }

            context.commit('setQuestionsInCurrentScriptInState', questions);
        },
        async setVariablesInCurrentScript (context) {
            let script = await getScriptById(this.getters.currentScriptId);
            let curScript = script.data[0];

            let variable = {};
            let variables = [];

            for (let variableId of curScript.variables) {
                variable = await getVariableById(variableId);
                variables.push(variable.data[0]);
            }

            context.commit('setVariablesInCurrentScriptInState', variables);
        },
        async setValuesOfVariableInRunningScript (context, variables) {
            context.commit('setValueOfVariableInRunningScriptInState', variables);
        }
    }
});
