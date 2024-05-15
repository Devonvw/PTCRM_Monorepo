"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPage } from "@/interfaces/page";
import { useClients } from "@/stores/useClients";
import { useEffect } from "react";

const ClientDetailGoalsPage = ({ params: { id } }: IPage) => {
  const { getClient, client, filterOptions, addModalOpen, setAddModalOpen } =
    useClients();

  useEffect(() => {
    if (client?.id != id) getClient(id);
  }, [id]);

  return (
    <div>
      <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Goal name</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <CardDescription className='pb-2'>Some description</CardDescription>
            <div className='grid gap-2 grid-cols-3'>
              <div className='flex flex-col'>
                <span>Started</span>
                <span className='text-xl font-bold'>65 kg</span>
              </div>
              <div className='flex flex-col'>
                <span>Currently</span>
                <span className='text-xl font-bold'>62 kg</span>
              </div>
              <div className='flex flex-col'>
                <span>Goal</span>
                <span className='text-xl font-bold'>58 kg</span>
              </div>
            </div>
            <p className='text-xs text-muted-foreground pt-2'>
              +42,9% of goal reached
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDetailGoalsPage;
