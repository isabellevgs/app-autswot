// Configuração do Axios com interceptors para autenticação

import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  logout,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "./authService";
import { isAuthCredentialEndpoint, shouldAttemptTokenRefresh } from "../utils/api-interceptors";
import { emitSessionExpired } from "../utils/auth-events";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;
const IS_DEV = import.meta.env.DEV;

if (IS_DEV) {
  console.log(`API: ${API_URL}`);
}

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

async function renovarAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token ausente");
    }

    const { data } = await axios.post(
      `${api.defaults.baseURL}/auth/refresh-token`,
      { refreshToken }
    );

    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

api.interceptors.request.use(
  async (config) => {
    if (isAuthCredentialEndpoint(config.url, config.baseURL ?? api.defaults.baseURL)) {
      delete config.headers.Authorization;
      return config;
    }

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (IS_DEV) {
      if (error.code === "ECONNREFUSED") {
        console.error(`Conexão recusada: ${API_URL}`);
      } else if (error.code === "ETIMEDOUT") {
        console.error(`Timeout na requisição: ${error.config?.url}`);
      } else if (error.response) {
        console.error(
          `API Error [${error.response.status}]:`,
          error.response.data
        );
      } else if (error.request) {
        console.error("Erro de rede: não foi possível conectar à API");
      }
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (shouldAttemptTokenRefresh(error, originalRequest, getAccessToken)) {
      originalRequest._retry = true;

      try {
        const accessToken = await renovarAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        const novoAccess = getAccessToken();
        const tokenAnterior = originalRequest.headers?.Authorization?.replace(/^Bearer\s+/i, '');
        if (novoAccess && novoAccess !== tokenAnterior && !originalRequest._storageRetry) {
          originalRequest._storageRetry = true;
          originalRequest.headers.Authorization = `Bearer ${novoAccess}`;
          return api(originalRequest);
        }
        logout();
        emitSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
