import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import {
  addCartItemController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from "./cart.controller.js";

export const cartRouter = Router();

cartRouter.get("/", authMiddleware, getCartController);
cartRouter.post("/items", authMiddleware, addCartItemController);
cartRouter.patch("/items/:productId", authMiddleware, updateCartItemController);
cartRouter.delete("/items/:productId", authMiddleware, removeCartItemController);
cartRouter.delete("/", authMiddleware, clearCartController);