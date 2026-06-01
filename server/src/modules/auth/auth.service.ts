import bcrypt from "bcryptjs";
import { pool } from "../../db/pool.js";
import { mapUserRow } from "./auth.mapper.js";
import { signToken } from "./jwt.js";
import type { AuthResponse, User, UserRole } from "./auth.types.js";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function getRoleByPhone(phone: string): UserRole {
  return phone === "70000000000" ? "ADMIN" : "USER";
}

export async function registerUser(
  phoneInput: string,
  password: string
): Promise<AuthResponse> {
  const phone = normalizePhone(phoneInput);

  if (phone.length < 10) {
    throw new Error("Введите корректный номер телефона");
  }

  if (password.length < 6) {
    throw new Error("Пароль должен содержать минимум 6 символов");
  }

  const existingUser = await pool.query(
    `
      SELECT id
      FROM users
      WHERE phone = $1
    `,
    [phone]
  );

  if (existingUser.rows[0]) {
    throw new Error("Пользователь с таким номером уже существует");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const role = getRoleByPhone(phone);

  const result = await pool.query(
    `
      INSERT INTO users (phone, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, phone, email, avatar_url, role, created_at
    `,
    [phone, passwordHash, role]
  );

  const user = mapUserRow(result.rows[0]);

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
}

export async function loginUser(
  phoneInput: string,
  password: string
): Promise<AuthResponse> {
  const phone = normalizePhone(phoneInput);

  const result = await pool.query(
    `
      SELECT id, phone, password_hash, email, avatar_url, role, created_at
      FROM users
      WHERE phone = $1
    `,
    [phone]
  );

  const userRow = result.rows[0];

  if (!userRow) {
    throw new Error("Неверный номер телефона или пароль");
  }

  const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);

  if (!isPasswordValid) {
    throw new Error("Неверный номер телефона или пароль");
  }

  const user = mapUserRow(userRow);

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
}

export async function getUserById(userId: number): Promise<User | null> {
  const result = await pool.query(
    `
      SELECT id, phone, email, avatar_url, role, created_at
      FROM users
      WHERE id = $1
    `,
    [userId]
  );

  const user = result.rows[0];

  return user ? mapUserRow(user) : null;
}

export async function updateUserProfile(
  userId: number,
  data: {
    email?: string;
    avatarUrl?: string;
  }
): Promise<User> {
  const email = data.email?.trim() || null;
  const avatarUrl = data.avatarUrl?.trim() || null;

  const result = await pool.query(
    `
      UPDATE users
      SET email = $1, avatar_url = $2
      WHERE id = $3
      RETURNING id, phone, email, avatar_url, role, created_at
    `,
    [email, avatarUrl, userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  return mapUserRow(user);
}