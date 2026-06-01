export type UserRole = "USER" | "ADMIN";

export type User = {
  id: number;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};