import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor with enhanced token debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    // Enhanced token debugging
    console.log("🔍 Token Debug:", {
      exists: !!token,
      length: token?.length,
      preview: token ? `${token.substring(0, 15)}...` : "none",
      storedAt: localStorage.getItem("tokenTimestamp"),
      url: config.url,
    });

    // Validate token format
    if (token) {
      if (!token.includes("|")) {
        console.warn("⚠️ Token format seems invalid:", token.substring(0, 15));
      }

      config.headers.Authorization = `Bearer ${token}`;

      // Verify header was set
      console.log("🔐 Auth Header Set:", {
        headerValue: config.headers.Authorization.substring(0, 25) + "...",
        headerExists: !!config.headers.Authorization,
      });
    } else {
      console.warn("⚠️ No auth token found for request:", {
        url: config.url,
        method: config.method,
        requiresAuth: !config.url?.includes("login"),
      });
    }

    // Log full request details
    console.log("🚀 API Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!config.headers.Authorization,
      contentType: config.headers["Content-Type"],
      data: config.data,
    });

    // Add email endpoints debugging
    if (config.url?.includes("/email")) {
      console.log("📧 Email API Request:", {
        endpoint: config.url,
        method: config.method,
        data: config.data,
        timestamp: new Date().toISOString(),
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", {
      message: error.message,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    // Add email-specific response logging
    if (response.config.url?.includes("/email")) {
      console.log("📧 Email API Response:", {
        endpoint: response.config.url,
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  },
  (error) => {
    // For 500 errors, log the complete error details
    if (error.response?.status === 500) {
      console.error("❌ Server Error:", {
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
        fullError: error,
        requestData: error.config?.data ? JSON.parse(error.config.data) : null,
      });
    }

    // Enhanced error logging for validation errors
    if (error.response?.status === 422) {
      console.error("❌ Validation error details:", {
        url: error.config?.url,
        data: error.response?.data,
        errors: error.response?.data?.errors,
        requestData: error.config?.data ? JSON.parse(error.config.data) : null,
        requestDataParsed: JSON.parse(error.config?.data || "{}"),
      });

      // Log more details about the validation error
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            console.error(`Field "${field}" validation failed:`, messages);
          }
        );
      }
      // Enhanced error object with validation details
      error.validationErrors = error.response?.data?.errors;
    }

    // Add more detailed error logging
    console.error("❌ Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      validationErrors: error.response?.data?.errors,
      message: error.message,
    });

    if (error.response?.status === 422) {
      console.error("❌ Validation errors:", error.response.data.errors);
    }

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

    console.error("❌ Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
