import { create } from "zustand";
import {
  removeAccessToken,
  setAccessToken,
} from "../../api/apiClient";
import {
  getMeRequest,
  loginRequest,
  registerRequest,
  updateProfileRequest,
} from "./authApi";

export type UserRole = "USER" | "ADMIN";

export type User = {
  id: number;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt?: string;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string;

  register: (phone: string, password: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: "",

  register: async (phone, password) => {
    set({ isLoading: true, error: "" });

    try {
      const response = await registerRequest({ phone, password });

      setAccessToken(response.token);
      set({ user: response.user });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ошибка регистрации";

      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (phone, password) => {
    set({ isLoading: true, error: "" });

    try {
      const response = await loginRequest({ phone, password });

      setAccessToken(response.token);
      set({ user: response.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ошибка входа";

      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: "" });

    try {
      const user = await getMeRequest();
      set({ user });
    } catch {
      removeAccessToken();
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    removeAccessToken();
    set({ user: null });
  },

  updateUser: async (userData) => {
    set({ isLoading: true, error: "" });

    try {
      const user = await updateProfileRequest({
        email: userData.email ?? undefined,
        avatarUrl: userData.avatarUrl ?? undefined,
      });

      set({ user });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ошибка обновления профиля";

      set({ error: message });
      throw new Error(message, { cause: error });
    } finally {
      set({ isLoading: false });
    }
  },
}));