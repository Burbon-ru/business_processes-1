import axios from "axios";

export function getVariableById (id) {
    return axios.get('http://localhost:3000/variables/?id=' + id);
}

export function getRunningScriptById (id) {
    return axios.get('http://localhost:3000/running_scripts/?id=' + id);
}

export function createRunningResult () {
    return axios.post('http://localhost:3000/running_scripts', {date_start: new Date(), variables: []});
}

export async function saveVariableValue (variableId, runningScriptId, value) {
    let res = await getRunningScriptById(runningScriptId);
    let variables = res.data[0].variables;

    let variable = {
        id: variableId,
        value: value
    };

    let finded = false;

    variables.map(el => {
        if (el.id == variableId) {
            finded = true;
        }
    });

    if (finded) {
        variables = variables.map(el => {
            if (el.id == variableId) {
                return variable;
            }

            return el;
        });
    } else {
        variables.push(variable);
    }

    return axios.patch('http://localhost:3000/running_scripts/' + runningScriptId, {variables: variables});
}
