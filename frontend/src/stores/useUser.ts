import axios from "axios";
import { create } from "zustand";

export const useUser = create((set: any, get: any) => ({
  infoMessage: {} as { message: string; isError: boolean },
  user: {} as any,
  status: {} as any,
  setUser: () => (user: any) => set({ user }),
  getLoggedInUser: async () => {
    try {
      const { data } = await axios.get("/backend/user/me");

      set({ user: data });
    } catch (error: any) {}
  },
  getUserPaymentStatus: async () => {
    try {
      const { data } = await axios.get("/backend/payment/user-status");

      set({ status: data });
    } catch (error: any) {}
  },
  logout: async (redirect: (path: string) => void) => {
    try {
      await axios.delete("/backend/auth/logout");

      set({ user: null });
      redirect("/login");
    } catch (error: any) {}
  },
  signUp: async (user: any, redirect: (href: string) => void) => {
    try {
      // Make the signup request with Axios
      const { data } = await axios.post("/backend/auth/signup", user);

      set({ infoMessage: { message: data?.message, isError: false } });

      // Redirect to the checkout page after 3 seconds
      setTimeout(() => {
        redirect(data?.checkoutHref);
        set({ infoMessage: {} });
      }, 3000);
    } catch (error: any) {
      set({
        infoMessage: { message: error?.response?.data?.message, isError: true },
      });
    }
  },
}));
