import { create } from "zustand";

type CheckoutModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useCheckoutModalStore = create<CheckoutModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));