import IInfoMessage from "@/interfaces/info-message";
import { IRedirect } from "@/interfaces/redirect";
import toastError from "@/utils/toast-error";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface IUser {
  [key: string]: any;
}

interface IPaymentStatus {
  hasMandate: boolean;
  paymentUrl: string;
}

interface IUseUserStore {
  infoMessage: IInfoMessage;
  user: IUser;
  status?: IPaymentStatus;
  setUser: (user: IUser) => void;
  getLoggedInUser: () => Promise<void>;
  updateLoggedInUser: (user: IUser) => Promise<void>;
  getUserPaymentStatus: () => Promise<void>;
  logout: (redirect: IRedirect) => Promise<void>;
  signUp: (user: IUser, redirect: IRedirect) => Promise<void>;
}

export const useUser = create<IUseUserStore>((set) => ({
  infoMessage: { message: "", isError: false },
  user: {},
  status: undefined,
  setUser: () => (user: IUser) => set({ user }),
  getLoggedInUser: async () => {
    try {
      const { data } = await axios.get("/backend/users/me");

      set({ user: data });
    } catch (error: any) {}
  },
  updateLoggedInUser: async (user: any) => {
    try {
      const { data } = await axios.put("/backend/users/me", user);

      set({ user: data?.user });
      toast.success(data?.message);
    } catch (error: any) {
      toastError(error?.response?.data?.message);
    }
  },
  getUserPaymentStatus: async () => {
    try {
      const { data } = await axios.get("/backend/payment/user-status");

      set({ status: data });
    } catch (error: any) {}
  },
  logout: async (redirect: IRedirect) => {
    try {
      await axios.delete("/backend/auth/logout");

      set({ user: {} });
      redirect("/login");
    } catch (error: any) {}
  },
  signUp: async (user: any, redirect: IRedirect) => {
    try {
      // Make the signup request with Axios
      const { data } = await axios.post("/backend/auth/signup", user);

      set({ infoMessage: { message: data?.message, isError: false } });

      // Redirect to the checkout page after 3 seconds
      setTimeout(() => {
        redirect(data?.checkoutHref);
        set({ infoMessage: { message: "", isError: false } });
      }, 3000);
    } catch (error: any) {
      set({
        infoMessage: { message: error?.response?.data?.message, isError: true },
      });
    }
  },
}));
