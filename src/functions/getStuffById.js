import axios from "axios";

export function getVariableById (id) {
    return axios.get('http://localhost:3000/variables/?id=' + id);
}

export function getScriptById (id) {
    return axios.get('http://localhost:3000/scripts/?id=' + id);
}

export function getQuestionById (id) {
    return axios.get('http://localhost:3000/questions/?id=' + id);
}
