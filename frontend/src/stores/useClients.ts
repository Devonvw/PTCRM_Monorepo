import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { Router } from "next/router";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useClients = create((set: any, get: any) => ({
  client: {} as any,
  clients: [],
  loading: undefined,
  signUpDetails: {} as any,
  signUpErrorMsg: "",
  dashboardData: {} as any,
  getClients: async (modules: {
    pagination?: any;
    search?: any;
    sort?: any;
    filters?: any;
  }): Promise<number> => {
    try {
      const { data } = await axios.get("/backend/clients", {
        params: {
          ...modules.pagination,
          ...modules.search,
          ...modules.sort,
          ...modules.filters,
        },
      });
      set((state: any) => ({
        clients: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    }
  },
  getClient: async (
    id: string,
    initialLoad?: boolean,
    redirect?: (path: string) => void
  ) => {
    if (initialLoad) set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/clients/${id}`);
      set((state: any) => ({
        client: data,
      }));
    } catch (e: any) {
      if (redirect) redirect("/app/clients");
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  createClient: async (client: any, reload?: IReload) => {
    try {
      await axios.post("/backend/clients", client);

      if (reload) reload();
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  createClientSignUp: async (client: any, reload?: IReload) => {
    try {
      const { data } = await axios.post("/backend/clients/sign-up", client);

      if (reload) reload();
      toast.success(data?.message);
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  updateClient: async (id: string, client: any, reload?: IReload) => {
    try {
      await axios.put(`/backend/clients/${id}`, client);

      if (reload) reload();
      set((state: any) => ({
        addModalOpen: false,
      }));
      toast.success("Client updated successfully.");
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  getClientDashboard: async (clientId: string) => {
    try {
      const { data } = await axios.get(
        `/backend/general/client-dashboard/${clientId}`
      );
      set({ dashboardData: data });
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  sortOptions: [
    {
      id: 1,
      name: "Naam A-Z",
      meta: { key: "name", direction: "ASC" },
    },
    {
      id: 2,
      name: "Naam Z-A",
      meta: { key: "name", direction: "DESC" },
    },
  ],
  filterOptions: [
    {
      id: 1,
      title: "Active",
      key: "active",
      selected: [],
      options: [
        {
          id: 1,
          title: "Actief",
          meta: { key: "true" },
        },
        {
          id: 2,
          title: "Niet actief",
          meta: { key: "false" },
        },
      ],
    },
  ],
  addModalOpen: false,
  setAddModalOpen: (open: boolean) => set({ addModalOpen: open }),
}));
