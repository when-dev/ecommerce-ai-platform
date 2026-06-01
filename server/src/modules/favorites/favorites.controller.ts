import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "./favorites.service.js";

export async function getFavoritesController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const favorites = await getFavorites(req.user.userId);

  res.json(favorites);
}

export async function addFavoriteController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const productId = Number(req.body.productId);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный товар" });
    return;
  }

  await addFavorite(req.user.userId, productId);

  const favorites = await getFavorites(req.user.userId);

  res.status(201).json(favorites);
}

export async function removeFavoriteController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const productId = Number(req.params.productId);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный товар" });
    return;
  }

  await removeFavorite(req.user.userId, productId);

  const favorites = await getFavorites(req.user.userId);

  res.json(favorites);
}