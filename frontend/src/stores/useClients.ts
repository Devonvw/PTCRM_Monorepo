import IFilterOption from "@/interfaces/filter-option";
import { IRedirect } from "@/interfaces/redirect";
import { IReload } from "@/interfaces/reload";
import ITableRequest from "@/interfaces/table-request";
import toastError from "@/utils/toast-error";
import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface IClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  housenumber: string;
  housenumberExtra: string;
  zipCode: string;
  city: string;
  country: string;
  active: boolean;
}

interface IClientStore {
  client?: IClient;
  clients: IClient[];
  loading: boolean | undefined;
  signUpErrorMsg: string;
  dashboardData: any;
  getClients: (modules: ITableRequest) => Promise<number>;
  getClient: (
    id: string,
    initialLoad?: boolean,
    redirect?: IRedirect
  ) => Promise<void>;
  createClient: (client: IClient, reload?: IReload) => Promise<void>;
  createClientSignUp: (client: IClient, reload?: IReload) => Promise<void>;
  updateClient: (
    id: string,
    client: IClient,
    reload?: IReload
  ) => Promise<void>;
  getClientDashboard: (clientId: string) => Promise<void>;
  filterOptions: Array<IFilterOption>;
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
}

export const useClients = create<IClientStore>((set) => ({
  client: undefined,
  clients: [],
  loading: undefined,
  signUpErrorMsg: "",
  dashboardData: {},
  getClients: async (modules: ITableRequest): Promise<number> => {
    try {
      const { data } = await axios.get("/backend/clients", {
        params: {
          ...modules.pagination,
          ...modules.search,
          ...modules.sort,
          ...modules.filters,
        },
      });
      set({
        clients: data?.data,
      });
      return data?.totalRows;
    } catch (e: any) {
      return 0;
    }
  },
  getClient: async (
    id: string,
    initialLoad?: boolean,
    redirect?: IRedirect
  ) => {
    if (initialLoad) set({ loading: true });
    try {
      const { data } = await axios.get(`/backend/clients/${id}`);
      set({
        client: data,
      });
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
      const { data } = await axios.put(`/backend/clients/${id}`, client);

      if (reload) reload();
      set({
        addModalOpen: false,
      });
      toast.success(data?.message);
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
