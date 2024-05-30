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
import { useRouter } from "next/navigation";
import ClientDetailLayout from "./components/layout";

const ClientDetailPage = ({ params: { id } }: IPage) => {
  const router = useRouter();
  const { getClient, getClientDashboard, dashboardData, loading, client } =
    useClients();

  useEffect(() => {
    if (client?.id != id) {
      getClient(id, true, router.push);
      getClientDashboard(id);
    }
  }, [id]);

  return (
    <ClientDetailLayout client={client} loading={loading}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Goals"
          value={dashboardData?.clientGoalsCount}
          icon={<ClipboardList className="w-4 h-4" />}
        />
        <OverviewCard
          title="Completed goals"
          value={dashboardData?.completedGoalsCount}
          icon={<SquareCheckBig className="w-4 h-4" />}
        />
        <OverviewCard
          title="Goals in-progress"
          value={dashboardData?.uncompletedGoalsCount}
          icon={<Goal className="w-4 h-4" />}
        />
        <OverviewCard
          title="Assessments performed"
          value={dashboardData?.clientAssessmentsCount}
          icon={<ListChecks className="w-4 h-4" />}
        />
      </div>
    </ClientDetailLayout>
  );
};

export default ClientDetailPage;
