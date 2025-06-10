import { create } from "zustand";
import { persist } from "zustand/middleware";

//auth store
type AuthState = {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: "" }),
    }),
    {
      name: "auth-storage",
    }
  )
);
