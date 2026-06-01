import { create } from "zustand";
import type { Product } from "../../types/product";

type ProductDetailsStore = {
  selectedProduct: Product | null;
  openProductDetails: (product: Product) => void;
  closeProductDetails: () => void;
};

export const useProductDetailsStore = create<ProductDetailsStore>((set) => ({
  selectedProduct: null,

  openProductDetails: (product) => set({ selectedProduct: product }),

  closeProductDetails: () => set({ selectedProduct: null }),
}));