import { apiRequest } from "../../api/apiClient";
import type { Product } from "../../types/product";

export function getFavoritesRequest() {
  return apiRequest<Product[]>("/favorites");
}

export function addFavoriteRequest(productId: number) {
  return apiRequest<Product[]>("/favorites", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function removeFavoriteRequest(productId: number) {
  return apiRequest<Product[]>(`/favorites/${productId}`, {
    method: "DELETE",
  });
}