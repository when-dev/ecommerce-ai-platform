import { apiRequest } from "../../api/apiClient";
import type { CartItem } from "./cartStore";

export function getCartRequest() {
  return apiRequest<CartItem[]>("/cart");
}

export function addCartItemRequest(productId: number) {
  return apiRequest<CartItem[]>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function updateCartItemRequest(productId: number, quantity: number) {
  return apiRequest<CartItem[]>(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItemRequest(productId: number) {
  return apiRequest<CartItem[]>(`/cart/items/${productId}`, {
    method: "DELETE",
  });
}

export function clearCartRequest() {
  return apiRequest<void>("/cart", {
    method: "DELETE",
  });
}