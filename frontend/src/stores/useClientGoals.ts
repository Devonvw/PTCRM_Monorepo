import { IReload } from "@/interfaces/reload";
import ITableRequest from "@/interfaces/table-request";
import toastError from "@/utils/toast-error";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

interface IClientGoal {
  [key: string]: any;
}

interface IUseClientGoalsStore {
  clientGoal: IClientGoal;
  clientGoals: IClientGoal[];
  loading: boolean | undefined;
  reload: boolean;
  getClientGoals: (
    modules: ITableRequest & {
      clientId: number;
    }
  ) => Promise<number>;
  getClientGoal: (id: number, initialLoad?: boolean) => Promise<void>;
  createClientGoal: (
    clientGoal: IClientGoal,
    reload?: IReload
  ) => Promise<void>;
  updateClientGoal: (
    clientGoal: IClientGoal,
    reload?: IReload
  ) => Promise<void>;
  deleteClientGoal: (id: number, reload?: IReload) => Promise<void>;
  addOrUpdateModalOpen: boolean;
  setAddOrUpdateModalOpen: (open: boolean) => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
}

export const useClientGoals = create<IUseClientGoalsStore>((set) => ({
  clientGoal: {},
  clientGoals: [],
  loading: undefined,
  reload: false,
  getClientGoals: async (
    modules: ITableRequest & {
      clientId: number;
    }
  ): Promise<number> => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/backend/client-goals", {
        params: {
          // ...modules.pagination,
          ...modules.filters,
          clientId: modules.clientId,
          pageIndex: modules.pagination["pageIndex"],
          pageSize: modules.pagination["pageSize"],
          show: modules.filters?.show,
        },
      });
      set(() => ({
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
      set(() => ({
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
      toast.success("Client goal created successfully.");
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  updateClientGoal: async (clientGoal: any, reload?: IReload) => {
    try {
      await axios.put(`/backend/client-goals/${clientGoal.id}`, clientGoal);

      if (reload) reload();
      toast.success("Client goal updated successfully.");
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  deleteClientGoal: async (id: number, reload?: IReload) => {
    try {
      await axios.delete(`/backend/client-goals/${id}`);

      if (reload) reload();
      toast.success("Client goal deleted successfully.");
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  addOrUpdateModalOpen: false,
  setAddOrUpdateModalOpen: (open: boolean) =>
    set({ addOrUpdateModalOpen: open }),
  deleteModalOpen: false,
  setDeleteModalOpen: (open: boolean) => set({ deleteModalOpen: open }),
}));
