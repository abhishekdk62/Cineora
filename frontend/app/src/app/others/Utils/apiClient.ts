import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
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

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ✅ CRITICAL: Don't intercept refresh endpoint failures!
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await apiClient.post('/auth/refresh');
        
        processQueue(null);
        
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Refresh failed:', refreshError);
        processQueue(refreshError);
        
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
