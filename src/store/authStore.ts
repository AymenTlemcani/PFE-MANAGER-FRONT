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
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  isTeacher: () => (get().user ? isTeacher(get().user!) : false),
  isStudent: () => (get().user ? isStudent(get().user!) : false),
  isCompany: () => (get().user ? isCompany(get().user!) : false),
  isAdmin: () => (get().user ? isAdmin(get().user!) : false),
}));
