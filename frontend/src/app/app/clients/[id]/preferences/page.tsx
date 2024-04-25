"use client";

import axios from "axios";
import { Metadata } from "next";
import { IPage } from "@/interfaces/page";
import { useClients } from "@/stores/useClients";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ClientDetailPreferencesPage = ({ params: { id } }: IPage) => {
  const { getClient, client, filterOptions, addModalOpen, setAddModalOpen } =
    useClients();

  useEffect(() => {
    if (client?.id != id) getClient(id);
  }, [id]);

  return <div></div>;
};

export default ClientDetailPreferencesPage;
