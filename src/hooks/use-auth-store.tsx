import { create } from "zustand";

type AuthStore = {
  callbackUrl: string | null;
  setCallbackUrl: (url: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  callbackUrl: null,
  setCallbackUrl: (url) => set({ callbackUrl: url }),
}));
