import axios from "axios";
import { queryClient } from "@/lib/query/query-client";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
      queryClient.clear();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        const redirect = encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        );
        window.location.assign(`/login?redirect=${redirect}`);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
