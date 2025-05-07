import axios from "axios";

const Axios = axios.create({
    baseURL: "https://image-smith.onrender.com",
    timeout:5000
})

export default Axios;