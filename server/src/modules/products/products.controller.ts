import type { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./products.service.js";
import { validateProductInput } from "./product.validation.js";

export async function getProductsController(_req: Request, res: Response) {
  const products = await getProducts();

  res.json(products);
}

export async function getProductByIdController(req: Request, res: Response) {
  const productId = Number(req.params.id);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный идентификатор товара" });
    return;
  }

  const product = await getProductById(productId);

  if (!product) {
    res.status(404).json({ message: "Товар не найден" });
    return;
  }

  res.json(product);
}

export async function createProductController(req: Request, res: Response) {
  try {
    const productInput = validateProductInput(req.body);
    const product = await createProduct(productInput);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Ошибка создания товара",
    });
  }
}

export async function updateProductController(req: Request, res: Response) {
  const productId = Number(req.params.id);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный идентификатор товара" });
    return;
  }

  try {
    const productInput = validateProductInput(req.body);
    const product = await updateProduct(productId, productInput);

    if (!product) {
      res.status(404).json({ message: "Товар не найден" });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Ошибка обновления товара",
    });
  }
}

export async function deleteProductController(req: Request, res: Response) {
  const productId = Number(req.params.id);

  if (!Number.isFinite(productId)) {
    res.status(400).json({ message: "Некорректный идентификатор товара" });
    return;
  }

  const isDeleted = await deleteProduct(productId);

  if (!isDeleted) {
    res.status(404).json({ message: "Товар не найден" });
    return;
  }

  res.status(204).send();
}