import axios from "axios";

const Axios = axios.create({
    baseURL: "https://image-smith-1.onrender.com/",
    timeout: 300000,
})

export default Axios;