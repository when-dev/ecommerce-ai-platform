import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware.js";
import {
  addCartItem,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "./cart.service.js";

export async function getCartController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const items = await getCartItems(req.user.userId);

  res.json(items);
}

export async function addCartItemController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const productId = Number(req.body.productId);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный товар" });
    return;
  }

  await addCartItem(req.user.userId, productId);

  const items = await getCartItems(req.user.userId);

  res.status(201).json(items);
}

export async function updateCartItemController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const productId = Number(req.params.productId);
  const quantity = Number(req.body.quantity);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный товар" });
    return;
  }

  if (!Number.isFinite(quantity)) {
    res.status(400).json({ message: "Некорректное количество" });
    return;
  }

  await updateCartItemQuantity(req.user.userId, productId, quantity);

  const items = await getCartItems(req.user.userId);

  res.json(items);
}

export async function removeCartItemController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  const productId = Number(req.params.productId);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный товар" });
    return;
  }

  await removeCartItem(req.user.userId, productId);

  const items = await getCartItems(req.user.userId);

  res.json(items);
}

export async function clearCartController(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  await clearCart(req.user.userId);

  res.status(204).send();
}