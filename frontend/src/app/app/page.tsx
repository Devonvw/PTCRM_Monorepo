"use client";
import PageHeader from "@/components/ui/page-header";
import { useGeneral } from "@/stores/useGeneral";
import { ClipboardList, Goal, ListChecks, SquareCheckBig } from "lucide-react";
import { useEffect } from "react";
import OverviewCard from "./clients/[id]/components/OverviewCard";

const Dashboard = () => {
  const { dashboardData, getUserDashboard } = useGeneral();

  useEffect(() => {
    getUserDashboard();
  }, []);

  return (
    <div>
      <PageHeader title="Overview" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Clients"
          value={dashboardData?.clientCount}
          icon={<ClipboardList className="w-4 h-4" />}
        />
        <OverviewCard
          title="Total Completed Goals"
          value={dashboardData?.completedGoalsCount}
          icon={<SquareCheckBig className="w-4 h-4" />}
        />
        <OverviewCard
          title=" Total Uncompleted Goals"
          value={dashboardData?.uncompletedGoalsCount}
          icon={<Goal className="w-4 h-4" />}
        />
        <OverviewCard
          title="Total Assessments"
          value={dashboardData?.assessmentCount}
          icon={<ListChecks className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
