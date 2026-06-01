import type { User, UserRole } from "./auth.types.js";

type UserRow = {
  id: number;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: Date;
};

export function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    phone: row.phone,
    email: row.email,
    avatarUrl: row.avatar_url,
    role: row.role,
    createdAt: row.created_at.toISOString(),
  };
}