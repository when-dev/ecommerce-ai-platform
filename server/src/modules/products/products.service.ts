import { pool } from "../../db/pool.js";
import { mapProductRow } from "./product.mapper.js";
import type { Product, ProductInput } from "./product.types.js";

export async function getProducts(): Promise<Product[]> {
  const result = await pool.query(`
    SELECT *
    FROM products
    ORDER BY id ASC
  `);

  return result.rows.map(mapProductRow);
}

export async function getProductById(productId: number): Promise<Product | null> {
  const result = await pool.query(
    `
      SELECT *
      FROM products
      WHERE id = $1
    `,
    [productId]
  );

  const product = result.rows[0];

  return product ? mapProductRow(product) : null;
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const result = await pool.query(
    `
      INSERT INTO products (
        title,
        brand,
        category,
        price,
        image_url,
        description,
        rating,
        stock,
        specs
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
    [
      product.title,
      product.brand,
      product.category,
      product.price,
      product.imageUrl,
      product.description,
      product.rating,
      product.stock,
      JSON.stringify(product.specs),
    ]
  );

  return mapProductRow(result.rows[0]);
}

export async function updateProduct(
  productId: number,
  product: ProductInput
): Promise<Product | null> {
  const result = await pool.query(
    `
      UPDATE products
      SET
        title = $1,
        brand = $2,
        category = $3,
        price = $4,
        image_url = $5,
        description = $6,
        rating = $7,
        stock = $8,
        specs = $9
      WHERE id = $10
      RETURNING *
    `,
    [
      product.title,
      product.brand,
      product.category,
      product.price,
      product.imageUrl,
      product.description,
      product.rating,
      product.stock,
      JSON.stringify(product.specs),
      productId,
    ]
  );

  const updatedProduct = result.rows[0];

  return updatedProduct ? mapProductRow(updatedProduct) : null;
}

export async function deleteProduct(productId: number): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM products
      WHERE id = $1
    `,
    [productId]
  );

  return result.rowCount !== null && result.rowCount > 0;
}