// axios.js
import axios from "axios";

const token = localStorage.getItem("access-token");

const instance = axios.create({
    baseURL: "http://localhost:8000/api",
});

instance.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
