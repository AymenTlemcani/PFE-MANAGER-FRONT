import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor with token refresh logic
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔐 Using token for request:", {
      url: config.url,
      tokenPreview: `${token.substring(0, 10)}...`,
    });
  } else {
    console.log("⚠️ No token found for request:", config.url);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("🚫 Authentication error:", error.response.data);

      // Clear auth data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Force reload only if not on login page
      if (!window.location.pathname.includes("login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
