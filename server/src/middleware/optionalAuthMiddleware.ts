import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./authMiddleware.js";
import { verifyToken } from "../modules/auth/jwt.js";

export function optionalAuthMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    next();
    return;
  }

  try {
    req.user = verifyToken(token);
  } catch {
    req.user = undefined;
  }

  next();
}