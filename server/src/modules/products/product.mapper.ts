import type { Product } from "./product.types.js";

type ProductRow = {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  rating: string | number;
  stock: number;
  specs: Product["specs"];
  created_at: Date;
};

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    imageUrl: row.image_url,
    description: row.description,
    rating: Number(row.rating),
    stock: Number(row.stock),
    specs: row.specs,
    createdAt: row.created_at.toISOString(),
  };
}