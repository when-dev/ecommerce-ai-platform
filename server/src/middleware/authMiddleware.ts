import type { NextFunction, Request, Response } from "express";
import { verifyToken, type JwtPayload } from "../modules/auth/jwt.js";

export type AuthRequest = Request & {
  user?: JwtPayload;
};

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    res.status(401).json({ message: "Некорректный токен авторизации" });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Недействительный токен" });
  }
}

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ message: "Доступ разрешен только администратору" });
    return;
  }

  next();
}