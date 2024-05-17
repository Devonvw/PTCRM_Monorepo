import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { create } from "zustand";

export const useClientGoals = create((set: any, get: any) => ({
  clientGoal: {} as any,
  clientGoals: [],
  loading: undefined,
  reload: false,
  getClientGoals: async (modules: {
    pagination: [pageIndex: number, pageSize: number];
    filters?: any;
    clientId: number;
  }): Promise<number> => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/backend/client-goals", {
        params: {
          // ...modules.pagination,
          ...modules.filters,
          clientId: modules.clientId,
          pageIndex: modules.pagination[0],
          pageSize: modules.pagination[1],
        },
      });
      set((state: any) => ({
        clientGoals: data?.data,
      }));
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    } finally {
      set({ loading: false });
    }
  },
  getClientGoal: async (id: number, initialLoad?: boolean) => {
    // if (initialLoad)
    set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/client-goals/${id}`);
      set((state: any) => ({
        clientGoal: data,
      }));
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  createClientGoal: async (clientGoal: any, reload?: IReload) => {
    try {
      await axios.post("/backend/client-goals", clientGoal);

      if (reload) reload();
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  updateClientGoal: async (clientGoal: any, reload?: IReload) => {
    try {
      await axios.put(`/backend/client-goals/${clientGoal.id}`, clientGoal);

      if (reload) reload();
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  deleteClientGoal: async (id: string, reload?: IReload) => {
    try {
      await axios.delete(`/backend/client-goals/${id}`);

      if (reload) reload();
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  filterOptions: [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Completed",
      value: "completed",
    },
    {
      label: "Uncompleted",
      value: "uncompleted",
    },
  ],
  addOrUpdateModalOpen: false,
  setAddOrUpdateModalOpen: (open: boolean) =>
    set({ addOrUpdateModalOpen: open }),
}));
