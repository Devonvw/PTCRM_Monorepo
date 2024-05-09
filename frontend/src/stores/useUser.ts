import { create } from "zustand";

export const useUser = create((set) => ({
  user: {} as any,
  setUser: () => (user: any) => set({ user }),
  logout: () => set({ user: {} }),
}));
