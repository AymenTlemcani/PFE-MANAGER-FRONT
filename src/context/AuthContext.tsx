import React, { createContext, useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getCurrentUser } from "../api/services/auth";
import type { User } from "../types";
import api from "../api/axios";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      console.group("🔍 Auth Initialization");
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");

      console.log("📦 Initial auth state:", {
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 10)}...` : null,
        hasStoredUser: !!storedUser,
      });

      if (token) {
        // Always set axios default header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          if (!storedUser) {
            console.log("🔄 No stored user, fetching...");
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } else {
            // Use stored user data initially, then verify in background
            setUser(JSON.parse(storedUser));
            getCurrentUser().catch((error) => {
              console.error("❌ Session validation failed:", error);
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              setUser(null);
            });
          }
        } catch (error) {
          console.error("❌ Auth initialization failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setUser(null);
        }
      }

      setIsLoading(false);
      console.groupEnd();
    };

    initAuth();
  }, [setUser]);

  console.log("🔄 AuthProvider rendering:", { user, isLoading });

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
