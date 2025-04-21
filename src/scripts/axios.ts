import axios from "axios";

export const Axios = axios.create({
    baseURL:"http://192.168.0.7:5636",
    timeout:5000
})