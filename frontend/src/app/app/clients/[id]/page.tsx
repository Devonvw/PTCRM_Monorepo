"use client";

import { IPage } from "@/interfaces/page";
import { useClients } from "@/stores/useClients";
import { ClipboardList, Goal, ListChecks, SquareCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OverviewCard from "./components/OverviewCard";
import ClientDetailLayout from "./components/layout";

const ClientDetailPage = ({ params: { id } }: IPage) => {
  const router = useRouter();
  const { getClient, loading, client } = useClients();

  useEffect(() => {
    if (client?.id != id) getClient(id, true, router.push);
  }, [id]);

  return (
    <ClientDetailLayout client={client} loading={loading}>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <OverviewCard
          title='Total Goals'
          value={25}
          extraInfo='Last added '
          icon={<ClipboardList className='w-4 h-4' />}
        />
        <OverviewCard
          title='Completed goals'
          value={25}
          extraInfo='Last completed '
          icon={<SquareCheckBig className='w-4 h-4' />}
        />
        <OverviewCard
          title='Goals in-progress'
          value={25}
          // extraInfo='Last completed at'
          icon={<Goal className='w-4 h-4' />}
        />
        <OverviewCard
          title='Assessments performed'
          value={25}
          extraInfo='Last performed '
          icon={<ListChecks className='w-4 h-4' />}
        />
      </div>
    </ClientDetailLayout>
  );
};

export default ClientDetailPage;
