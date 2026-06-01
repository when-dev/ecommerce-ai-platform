import type { ProductInput } from "./product.types.js";

export function validateProductInput(body: unknown): ProductInput {
  if (!body || typeof body !== "object") {
    throw new Error("Некорректные данные товара");
  }

  const data = body as Record<string, unknown>;

  const title = String(data.title ?? "").trim();
  const brand = String(data.brand ?? "").trim();
  const category = String(data.category ?? "").trim();
  const imageUrl = String(data.imageUrl ?? "").trim();
  const description = String(data.description ?? "").trim();

  const price = Number(data.price);
  const rating = Number(data.rating);
  const stock = Number(data.stock);

  const specs = Array.isArray(data.specs)
    ? data.specs.map((spec) => {
        const item = spec as Record<string, unknown>;

        return {
          label: String(item.label ?? "").trim(),
          value: String(item.value ?? "").trim(),
        };
      })
    : [];

  if (!title) {
    throw new Error("Введите название товара");
  }

  if (!brand) {
    throw new Error("Введите бренд товара");
  }

  if (!category) {
    throw new Error("Введите категорию товара");
  }

  if (!imageUrl) {
    throw new Error("Добавьте ссылку на изображение товара");
  }

  if (!description) {
    throw new Error("Введите описание товара");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Введите корректную цену товара");
  }

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    throw new Error("Рейтинг должен быть от 0 до 5");
  }

  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error("Введите корректное количество товара");
  }

  return {
    title,
    brand,
    category,
    price,
    imageUrl,
    description,
    rating,
    stock,
    specs,
  };
}