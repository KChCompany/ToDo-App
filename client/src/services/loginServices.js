import axios from "axios";
const apiUrl = "https://todo-app-kch.herokuapp.com/api/login";


export function loginUser(user) {
    return axios.post(apiUrl, user, {headers: {'Content-Type': 'application/json',}});
}
