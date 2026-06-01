import { mapProductRow } from "../products/product.mapper.js";
import type { Product } from "../products/product.types.js";

type CartItemRow = {
  cart_item_id: number;
  quantity: number;

  product_id: number;
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

export function mapCartItemRow(row: CartItemRow) {
  return {
    id: row.cart_item_id,
    product: mapProductRow({
      id: row.product_id,
      title: row.title,
      brand: row.brand,
      category: row.category,
      price: row.price,
      image_url: row.image_url,
      description: row.description,
      rating: row.rating,
      stock: row.stock,
      specs: row.specs,
      created_at: row.created_at,
    }),
    quantity: Number(row.quantity),
  };
}