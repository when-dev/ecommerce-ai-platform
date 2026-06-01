import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import {
  addFavoriteController,
  getFavoritesController,
  removeFavoriteController,
} from "./favorites.controller.js";

export const favoritesRouter = Router();

favoritesRouter.get("/", authMiddleware, getFavoritesController);
favoritesRouter.post("/", authMiddleware, addFavoriteController);
favoritesRouter.delete("/:productId", authMiddleware, removeFavoriteController);