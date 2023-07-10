import router from '@/router'
import axios from 'axios'
import store from "@/store"

const api = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            config.headers.common["Authorization"] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        if (response.status === 200 || response.status === 201) {
            const token = response.headers['authorization'];
            if (token) {
                localStorage.setItem("jwt-token", token.replace("Bearer ", ""));
            }
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                case 401:
                    store.dispatch("auth/logout");
                    if (router.currentRoute.name !== 'Login') {
                        router.replace({
                            path: "/login",
                            query: { redirect: router.currentRoute.fullPath }
                        });
                    }
                    break;
                case 403:
                    break;
            }
            return Promise.reject(error.response);
        }
    }
);

export default api;
