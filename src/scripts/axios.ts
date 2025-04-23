import axios from "axios";

export const Axios = axios.create({
    baseURL: "https://image-smith.onrender.com",
    timeout:5000
})