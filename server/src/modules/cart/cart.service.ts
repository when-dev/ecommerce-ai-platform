import { pool } from "../../db/pool.js";
import { mapCartItemRow } from "./cart.mapper.js";

export async function getCartItems(userId: number) {
  const result = await pool.query(
    `
      SELECT
        cart_items.id AS cart_item_id,
        cart_items.quantity,

        products.id AS product_id,
        products.title,
        products.brand,
        products.category,
        products.price,
        products.image_url,
        products.description,
        products.rating,
        products.stock,
        products.specs,
        products.created_at
      FROM cart_items
      JOIN products ON products.id = cart_items.product_id
      WHERE cart_items.user_id = $1
      ORDER BY cart_items.id ASC
    `,
    [userId]
  );

  return result.rows.map(mapCartItemRow);
}

export async function addCartItem(userId: number, productId: number) {
  const result = await pool.query(
    `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, 1)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + 1
      RETURNING id
    `,
    [userId, productId]
  );

  return result.rows[0];
}

export async function updateCartItemQuantity(
  userId: number,
  productId: number,
  quantity: number
) {
  if (quantity <= 0) {
    await removeCartItem(userId, productId);
    return;
  }

  await pool.query(
    `
      UPDATE cart_items
      SET quantity = $1
      WHERE user_id = $2 AND product_id = $3
    `,
    [quantity, userId, productId]
  );
}

export async function removeCartItem(userId: number, productId: number) {
  await pool.query(
    `
      DELETE FROM cart_items
      WHERE user_id = $1 AND product_id = $2
    `,
    [userId, productId]
  );
}

export async function clearCart(userId: number) {
  await pool.query(
    `
      DELETE FROM cart_items
      WHERE user_id = $1
    `,
    [userId]
  );
}