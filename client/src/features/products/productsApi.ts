import { apiRequest } from "../../api/apiClient";
import type { Product } from "../../types/product";

export type ProductInput = Omit<Product, "id" | "createdAt">;

export function getProductsRequest() {
  return apiRequest<Product[]>("/products");
}

export function createProductRequest(product: ProductInput) {
  return apiRequest<Product>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProductRequest(productId: number, product: ProductInput) {
  return apiRequest<Product>(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(product),
  });
}

export function deleteProductRequest(productId: number) {
  return apiRequest<void>(`/products/${productId}`, {
    method: "DELETE",
  });
}