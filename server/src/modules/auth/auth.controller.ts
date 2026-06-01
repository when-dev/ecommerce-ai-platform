import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import {
  getUserById,
  loginUser,
  registerUser,
  updateUserProfile,
} from "./auth.service.js";
import type { Request } from "express";

export async function registerController(req: Request, res: Response) {
  try {
    const { phone, password } = req.body;

    const result = await registerUser(String(phone ?? ""), String(password ?? ""));

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Ошибка регистрации",
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { phone, password } = req.body;

    const result = await loginUser(String(phone ?? ""), String(password ?? ""));

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Ошибка входа",
    });
  }
}

export async function meController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const user = await getUserById(req.user.userId);

  if (!user) {
    res.status(404).json({ message: "Пользователь не найден" });
    return;
  }

  res.json(user);
}

export async function updateProfileController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  try {
    const user = await updateUserProfile(req.user.userId, {
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Ошибка обновления профиля",
    });
  }
}