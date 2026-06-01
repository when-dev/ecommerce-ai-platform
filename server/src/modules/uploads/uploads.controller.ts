import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";

export async function uploadAvatarController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: "Файл не загружен" });
    return;
  }

  const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${
    req.file.filename
  }`;

  res.status(201).json({
    avatarUrl,
  });
}