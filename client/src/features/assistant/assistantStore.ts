import { create } from "zustand";

type AssistantStore = {
  isOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
};

export const useAssistantStore = create<AssistantStore>((set) => ({
  isOpen: false,

  openAssistant: () => set({ isOpen: true }),
  closeAssistant: () => set({ isOpen: false }),
  toggleAssistant: () => set((state) => ({ isOpen: !state.isOpen })),
}));