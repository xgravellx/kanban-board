import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://localhost:80/',
    timeout: 1200,
})