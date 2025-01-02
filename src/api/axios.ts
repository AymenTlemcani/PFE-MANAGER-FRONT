import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        break;
      case 403:
        console.error("Permission denied");
        break;
      case 422:
        // Validation errors
        return Promise.reject(error.response.data);
      case 429:
        console.error("Too many requests");
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
