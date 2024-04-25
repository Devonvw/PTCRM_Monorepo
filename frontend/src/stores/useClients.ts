import { IReload } from "@/interfaces/reload";
import toastError from "@/utils/toast-error";
import axios from "axios";
import { Router } from "next/router";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useClients = create((set: any, get: any) => ({
  client: {} as any,
  clients: [],
  loading: undefined,
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
  getClient: async (id: string) => {
    try {
      const { data } = await axios.get(`/backend/clients/${id}`);
      set((state: any) => ({
        client: data,
      }));
    } catch (e: any) {
      toastError(e?.response?.data?.message);
    }
  },
  createClient: async (client: any, reload?: IReload) => {
    try {
      await axios.post("/backend/clients", client);

      if (reload) reload();
      set((state: any) => ({
        addModalOpen: false,
      }));
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
    {
      id: 3,
      name: "Aantal schepen - Oplopend",
      meta: { key: "ship_count", direction: "ASC" },
    },
    {
      id: 4,
      name: "Aantal schepen - Aflopend",
      meta: { key: "ship_count", direction: "DESC" },
    },
  ],
  filterOptions: [
    {
      id: 1,
      title: "Actief",
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
