import axios from "axios";

export function getScriptById (id) {
    return axios.get('http://localhost:3000/scripts/?id=' + id);
}

export function getQuestionById (id) {
    return axios.get('http://localhost:3000/questions/?id=' + id);
}

export function getVariableById (id) {
    return axios.get('http://localhost:3000/variables/?id=' + id);
}

export function getAnswerById (id) {
    return axios.get('http://localhost:3000/answers/?id=' + id);
}

export function getAnswerStatusById (id) {
    return axios.get('http://localhost:3000/answer_statuses/?id=' + id);
}

export async function getAnswersOfQuestionById (id) {
    try {
        let answer = {};
        let answers = [];

        let question = await getQuestionById(id);

        for (let answerId of question.data[0].answers) {
            answer = await getAnswerById(answerId);
            answers.push(answer.data[0]);
        }

        return answers;
    } catch (error) {
        console.error(error);
        return error;
    }
}
