import axios from "axios";


import { useUserStore } from "@/src/stores/user-store";

function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return process.env.NEXT_PUBLIC_BASE_URL;
}

export const axiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    let token = useUserStore.getState().token;
    if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const { logout } = useUserStore.getState();
            await logout();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

