import { create } from "zustand";
import type { Product } from "../../types/product";
import {
  createProductRequest,
  deleteProductRequest,
  getProductsRequest,
  updateProductRequest,
  type ProductInput,
} from "./productsApi";

type ProductsStore = {
  products: Product[];
  isLoading: boolean;
  error: string;

  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductInput) => Promise<void>;
  updateProduct: (productId: number, product: ProductInput) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  getProductById: (productId: number) => Product | undefined;
};

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: "",

  fetchProducts: async () => {
    set({ isLoading: true, error: "" });

    try {
      const products = await getProductsRequest();
      set({ products });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить товары",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    const createdProduct = await createProductRequest(product);

    set((state) => ({
      products: [createdProduct, ...state.products],
    }));
  },

  updateProduct: async (productId, product) => {
    const updatedProduct = await updateProductRequest(productId, product);

    set((state) => ({
      products: state.products.map((item) =>
        item.id === productId ? updatedProduct : item
      ),
    }));
  },

  deleteProduct: async (productId) => {
    await deleteProductRequest(productId);

    set((state) => ({
      products: state.products.filter((item) => item.id !== productId),
    }));
  },

  getProductById: (productId) => {
    return get().products.find((product) => product.id === productId);
  },
}));