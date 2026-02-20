import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenService } from "./tokenService";
import { authService } from "./authService";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR (Refresh automático)
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // 🔹 401 → tenta refresh
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();

        if (!refreshToken) {
          tokenService.clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await authService.refreshToken(refreshToken);

        tokenService.setTokens(response.accessToken, response.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        tokenService.clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 🔹 403 → acesso negado → logout direto
    if (error.response?.status === 403) {
      tokenService.clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
