import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";

export interface PasswordChangeResponse {
  message: string;
}

export interface ValidationError {
  errors?: {
    current_password?: string[];
    new_password?: string[];
  };
  message?: string;
}

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<PasswordChangeResponse> => {
  try {
    const response = await api.post<PasswordChangeResponse>(
      API_ENDPOINTS.auth.changePassword,
      {
        current_password: currentPassword,
        new_password: newPassword,
      }
    );
    return response.data;
  } catch (error) {
    // Add better error context
    if (error.response?.status === 422) {
      throw {
        ...error,
        message: "Password validation failed",
      };
    }
    throw error;
  }
};
