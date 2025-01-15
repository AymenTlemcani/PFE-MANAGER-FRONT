import api from "../axios";
import { API_ENDPOINTS } from "../endpoints";
import type {
  User,
  ProfileUpdateData,
  AuthResponse,
  Teacher,
  Student,
  Company,
  Administrator,
} from "../../types";

export async function login(email: string, password: string): Promise<User> {
  try {
    console.group("🔐 Login Process");
    console.log("📡 Sending login request...");

    const response = await api.post<AuthResponse>(API_ENDPOINTS.auth.login, {
      email,
      password,
    });

    const { user, token, must_change_password } = response.data;

    console.log("✅ Login successful, storing auth data:", {
      tokenPreview: token ? `${token.substring(0, 10)}...` : null,
      user: user.email,
      must_change_password,
    });

    localStorage.setItem("authToken", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, must_change_password })
    );
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Verify token was stored correctly
    const storedToken = localStorage.getItem("authToken");
    console.log("🔍 Token storage verification:", {
      tokenStored: !!storedToken,
      headerSet: !!api.defaults.headers.common["Authorization"],
    });

    console.groupEnd();
    return user;
  } catch (error) {
    console.error("❌ Login failed:", error);
    console.groupEnd();
    if (error && typeof error === "object" && "response" in error) {
      const errorResponse = error as {
        response?: {
          data?: { errors?: { credentials?: string[] }; message?: string };
        };
      };
      if (errorResponse.response?.data?.errors?.credentials) {
        throw new Error(errorResponse.response.data.errors.credentials[0]);
      }
      if (errorResponse.response?.data?.message) {
        throw new Error(errorResponse.response.data.message);
      }
    }
    throw new Error("Invalid email or password");
  }
}

export async function logout(): Promise<void> {
  console.log("🔄 Logging out...");
  try {
    await api.post(API_ENDPOINTS.auth.logout);
  } catch (error) {
    console.warn("⚠️ Logout request failed:", error);
  } finally {
    // Clear auth data regardless of logout request success
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    console.log("✅ Logout completed, auth data cleared");
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get(API_ENDPOINTS.auth.me);
  return response.data.user;
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post(API_ENDPOINTS.auth.forgotPassword, { email });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  await api.post(API_ENDPOINTS.auth.resetPassword, { token, password });
}

export async function validateResetToken(token: string): Promise<boolean> {
  const response = await api.post(API_ENDPOINTS.auth.validateResetToken, {
    token,
  });
  return response.data.valid;
}

export async function updateProfile(data: ProfileUpdateData): Promise<User> {
  const response = await api.put(API_ENDPOINTS.auth.updateProfile, data);
  return response.data.user;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await api.post(API_ENDPOINTS.auth.changePassword, {
    current_password: currentPassword,
    password: newPassword,
  });
}

export function isTeacher(user: User): user is Teacher {
  return user.role === "Teacher";
}

export function isStudent(user: User): user is Student {
  return user.role === "Student";
}

export function isCompany(user: User): user is Company {
  return user.role === "Company";
}

export function isAdmin(user: User): user is Administrator {
  return user.role === "Administrator";
}

export function isResponsibleTeacher(user: User): boolean {
  return user.role === "Teacher" && (user as Teacher).teacher.is_responsible;
}
