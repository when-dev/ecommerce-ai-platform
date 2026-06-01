import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
} from "./products.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../../middleware/authMiddleware.js";

export const productsRouter = Router();

productsRouter.get("/", getProductsController);
productsRouter.get("/:id", getProductByIdController);
productsRouter.post("/", authMiddleware, adminMiddleware, createProductController);
productsRouter.patch("/:id", authMiddleware, adminMiddleware, updateProductController);
productsRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProductController);