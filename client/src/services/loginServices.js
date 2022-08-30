import axios from "axios";
const apiUrl = "http://localhost:8080/api/login";


export function loginUser(user) {
    return axios.post(apiUrl, user, {headers: {'Content-Type': 'application/json',}});
}
