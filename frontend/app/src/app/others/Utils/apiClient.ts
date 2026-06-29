import axios from "axios";
import AUTH_ROUTES from "../constants/authConstants/authConstants";
import { authStorage } from "./authStorage";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_NODE_ENV == "dev"
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL_PROD,

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
  isRefreshing = false;
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  const publicPaths = ["/login", "/signup", "/forgot-password"];
  if (publicPaths.some((path) => window.location.pathname.startsWith(path))) {
    return;
  }
  window.location.href = "/login";
};

apiClient.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes(AUTH_ROUTES.REFRESH)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = authStorage.getRefreshToken();
        const refreshResponse = await apiClient.post(AUTH_ROUTES.REFRESH, {
          refreshToken,
        });

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          authStorage.setTokens(newAccessToken, newRefreshToken);
        }

        processQueue(null);

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error(" Refresh failed:", refreshError);
        processQueue(refreshError);
        authStorage.clear();
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      authStorage.clear();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
