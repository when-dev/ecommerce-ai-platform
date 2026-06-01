import { pool } from "../../db/pool.js";
import { mapProductRow } from "../products/product.mapper.js";

export async function getFavorites(userId: number) {
  const result = await pool.query(
    `
      SELECT products.*
      FROM favorites
      JOIN products ON products.id = favorites.product_id
      WHERE favorites.user_id = $1
      ORDER BY favorites.id ASC
    `,
    [userId]
  );

  return result.rows.map(mapProductRow);
}

export async function addFavorite(userId: number, productId: number) {
  await pool.query(
    `
      INSERT INTO favorites (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id)
      DO NOTHING
    `,
    [userId, productId]
  );
}

export async function removeFavorite(userId: number, productId: number) {
  await pool.query(
    `
      DELETE FROM favorites
      WHERE user_id = $1 AND product_id = $2
    `,
    [userId, productId]
  );
}