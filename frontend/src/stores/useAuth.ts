import { API_URL } from "@/constants";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { Router } from "next/router";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuth = create<any>()(
  persist(
    (set, get) => ({
      user: null,
      logout: async (redirect: (path: string) => void) => {
        try {
          await axios.delete("/backend/auth/logout");

          set({ user: null });
          redirect("/login");
        } catch (error: any) {}
      },
      login: async (
        user: any,
        redirect: (path: string) => void,
        setInfoMessage: (msg: any) => void
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
          set({
            infoMessage: {
              message: error?.response?.data?.message,
              isError: true,
            },
          });
        }
      },
      signUp: async (
        user: any,
        redirect: (href: string) => void,
        setInfoMessage: (msg: any) => void
      ) => {
        try {
          // Make the signup request with Axios
          const { data } = await axios.post("/backend/auth/signup", user);

          setInfoMessage({ message: data?.message, isError: false });

          // Redirect to the checkout page after 3 seconds
          setTimeout(() => {
            redirect(data?.checkoutHref);
            setInfoMessage({});
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
