import IInfoMessage from "@/interfaces/info-message";
import { IRedirect } from "@/interfaces/redirect";
import toastError from "@/utils/toast-error";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  [key: string]: any;
}

interface IUseAuthStore {
  user?: IUser;
  logout: (redirect: IRedirect) => Promise<void>;
  login: (
    user: IUser,
    redirect: IRedirect,
    setInfoMessage: (msg: IInfoMessage) => void
  ) => Promise<void>;
  signUp: (
    user: IUser,
    redirect: IRedirect,
    setInfoMessage: (msg: IInfoMessage) => void
  ) => Promise<void>;
}

export const useAuth = create<IUseAuthStore>()(
  persist(
    (set) => ({
      user: undefined,
      logout: async (redirect: IRedirect) => {
        try {
          await axios.delete("/backend/auth/logout");

          set({ user: undefined });
          redirect("/login");
        } catch (error: any) {
          toastError(error?.response?.data?.message);
        }
      },
      login: async (
        user: IUser,
        redirect: IRedirect,
        setInfoMessage: (msg: IInfoMessage) => void
      ) => {
        try {
          const { data } = await axios.post("/backend/auth/login", user);

          set({
            user: data?.user,
          });
          setInfoMessage({ message: data?.message, isError: false });
          toast.success(data?.message);
          redirect("/app");
        } catch (error: any) {
          setInfoMessage({
            message: error?.response?.data?.message,
            isError: true,
          });
        }
      },
      signUp: async (
        user: IUser,
        redirect: IRedirect,
        setInfoMessage: (msg: IInfoMessage) => void
      ) => {
        try {
          // Make the signup request with Axios
          const { data } = await axios.post("/backend/auth/signup", user);

          setInfoMessage({ message: data?.message, isError: false });

          // Redirect to the checkout page after 3 seconds
          setTimeout(() => {
            redirect(data?.checkoutHref);
            setInfoMessage({ message: "", isError: false });
          }, 3000);
        } catch (error: any) {
          setInfoMessage({
            message: error?.response?.data?.message,
            isError: true,
          });
        }
      },
    }),

    { name: "auth" }
  )
);
