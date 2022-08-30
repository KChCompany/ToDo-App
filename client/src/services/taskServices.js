import axios from "axios";
const apiUrl = "https://todo-app-kch.herokuapp.com";

export async function getTasks(page, sort) {
    return axios.get(apiUrl, {params: {page, sort}});
}

export function addTask(task) {
    return axios.post(apiUrl, task);
}

export function updateTask(id, task, token) {
    return axios.put(apiUrl + "/" + id, task, {headers: { "x-access-token" : token}});
}

export function deleteTask(id, token) {
    return axios.delete(apiUrl + "/" + id, {headers: { "x-access-token" : token}});
}
