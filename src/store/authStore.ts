import { create } from "zustand";
import type { User } from "../types";
import { isTeacher, isStudent, isCompany, isAdmin } from "../services/auth";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isTeacher: () => boolean;
  isStudent: () => boolean;
  isCompany: () => boolean;
  isAdmin: () => boolean;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    // Sync user data to localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },
  hydrateFromStorage: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
  isTeacher: () => (get().user ? isTeacher(get().user!) : false),
  isStudent: () => (get().user ? isStudent(get().user!) : false),
  isCompany: () => (get().user ? isCompany(get().user!) : false),
  isAdmin: () => (get().user ? isAdmin(get().user!) : false),
}));

// Listen for storage events across tabs
window.addEventListener("storage", (event) => {
  if (event.key === "user") {
    useAuthStore.getState().hydrateFromStorage();
  }
});

// Initial hydration
useAuthStore.getState().hydrateFromStorage();
