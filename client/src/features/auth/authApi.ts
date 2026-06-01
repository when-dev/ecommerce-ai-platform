import { apiRequest } from "../../api/apiClient";
import type { User } from "./authStore";

export type AuthResponse = {
  user: User;
  token: string;
};

export function registerRequest(data: { phone: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginRequest(data: { phone: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMeRequest() {
  return apiRequest<User>("/auth/me");
}

export function updateProfileRequest(data: {
  email?: string;
  avatarUrl?: string;
}) {
  return apiRequest<User>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}