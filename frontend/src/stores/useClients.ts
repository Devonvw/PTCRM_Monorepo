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
  sortOptions: [
    {
      id: 1,
      name: "Naam A-Z",
      meta: { key: "name", direction: "asc" },
    },
    {
      id: 2,
      name: "Naam Z-A",
      meta: { key: "name", direction: "desc" },
    },
    {
      id: 3,
      name: "Aantal schepen - Oplopend",
      meta: { key: "ship_count", direction: "asc" },
    },
    {
      id: 4,
      name: "Aantal schepen - Aflopend",
      meta: { key: "ship_count", direction: "desc" },
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
    {
      id: 2,
      title: "Type",
      key: "type",
      selected: [],
      options: [
        {
          id: 1,
          title: "Beheerder",
          meta: { key: "MANAGER" },
        },
        {
          id: 2,
          title: "VVE",
          meta: { key: "VVE" },
        },
        {
          id: 3,
          title: "Zakelijk",
          meta: { key: "COMPANY" },
        },
        {
          id: 4,
          title: "Particulier",
          meta: { key: "PRIVATE" },
        },
      ],
    },
  ],
}));
