import { mapProductRow } from "../products/product.mapper.js";
import type { Product } from "../products/product.types.js";

type OrderItemRow = {
  order_item_id: number;
  quantity: number;
  price: number;

  product_id: number;
  title: string;
  brand: string;
  category: string;
  product_price: number;
  image_url: string;
  description: string;
  rating: string | number;
  stock: number;
  specs: Product["specs"];
  product_created_at: Date;
};

export function mapOrderItemRow(row: OrderItemRow) {
  return {
    id: row.order_item_id,
    quantity: Number(row.quantity),
    price: Number(row.price),
    product: mapProductRow({
      id: row.product_id,
      title: row.title,
      brand: row.brand,
      category: row.category,
      price: row.product_price,
      image_url: row.image_url,
      description: row.description,
      rating: row.rating,
      stock: row.stock,
      specs: row.specs,
      created_at: row.product_created_at,
    }),
  };
}