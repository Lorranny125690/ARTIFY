import axios from "axios";

export const Axios = axios.create({
    baseURL:"http://127.0.0.1:5636",
    timeout:5000
})