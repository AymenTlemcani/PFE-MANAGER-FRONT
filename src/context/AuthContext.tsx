import React, { createContext, useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getCurrentUser } from "../api/services/auth";
import type { User } from "../types";

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
      console.log("🔍 AuthProvider: Initializing auth...");
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      console.log("📦 Stored data:", {
        hasToken: !!token,
        hasUser: !!storedUser,
      });

      if (token && storedUser) {
        try {
          console.log("🔄 Fetching current user...");
          const currentUser = await getCurrentUser();
          console.log("✅ User fetched:", currentUser);
          setUser(currentUser);
        } catch (error) {
          console.error("❌ Auth initialization failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        console.log("⚠️ No stored credentials found");
        setUser(null);
      }
      setIsLoading(false);
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
