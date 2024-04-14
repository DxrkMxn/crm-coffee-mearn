import axios from 'axios';

const BASE_URL = 'https://crm-backend-atjh.onrender.com/api/v1/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axiosPrivate.interceptors.request.use(
    config => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

const api = {
    public: axiosInstance,
    private: axiosPrivate,
};

export default api;
