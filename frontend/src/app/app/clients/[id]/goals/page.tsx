"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPage } from "@/interfaces/page";
import { useClientGoals } from "@/stores/useClientGoals";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilLine,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import CreateUpdateClientGoalModal from "./components/CreateEditClientGoal-Modal";

const ClientDetailGoalsPage = ({ params: { id } }: IPage) => {
  //. Get the client goals
  const {
    getClientGoals,
    clientGoals,
    addModalOpen,
    setAddModalOpen,
    loading,
    reload,
  } = useClientGoals();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const pageSize = 4;

  const canGetNextPage = () => {
    return totalRows > pageSize * (currentPage + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setTotalRows(
        await getClientGoals({
          clientId: Number(id),
          pagination: [currentPage, pageSize],
        })
      );
      console.log("id", id);
    };
    fetchData();
  }, [id, currentPage, reload]);

  const calculateProgress = (
    startValue: number,
    currentValue: number,
    completedValue: number
  ) => {
    //. Calculate the progress
    const progress =
      ((currentValue - startValue) / (completedValue - startValue)) * 100;
    //. Return the progress with 1 decimal
    return progress.toFixed(1);
  };
  // const { getClient, client, filterOptions, addModalOpen, setAddModalOpen } =
  //   useClients();

  // useEffect(() => {
  //   if (client?.id != id) getClient(id);
  // }, [id]);

  return (
    <div>
      <CreateUpdateClientGoalModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <div className='flex justify-between'>
        <div className='flex flex-row space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!canGetNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => setCurrentPage(Math.floor(totalRows / pageSize) - 1)}
            disabled={!canGetNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
        <Button
          size='sm'
          variant='light'
          className=''
          onClick={() => setCreateModalOpen(true)}
        >
          Add Client Goal <PlusCircle className='h-5 w-5' />
        </Button>
      </div>
      <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-2 pt-2'>
        {loading ? (
          <span>Loading...</span>
        ) : (
          clientGoals.map((clientGoal) => {
            const measurementUnit = clientGoal["goal"]["measurementUnit"];
            const progress = calculateProgress(
              clientGoal["startValue"],
              clientGoal["currentValue"],
              clientGoal["completedValue"]
            );
            return (
              <Card key={clientGoal["id"]}>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {clientGoal["goal"]["name"]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='pb-2'>
                    {clientGoal["goal"]["description"]}
                  </CardDescription>
                  <div className='grid gap-2 grid-cols-3'>
                    <div className='flex flex-col'>
                      <span>Started</span>
                      <span className='text-xl font-bold'>
                        {clientGoal["startValue"]} {measurementUnit}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span>Currently</span>
                      <span className='text-xl font-bold'>
                        {clientGoal["currentValue"]} {measurementUnit}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span>Goal</span>
                      <span className='text-xl font-bold'>
                        {clientGoal["completedValue"]} {measurementUnit}
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-sm text-muted-foreground pt-2 items-center flex'>
                      {progress}% of goal reached
                    </p>
                    <Button className='mt-2' type='submit' size='sm'>
                      Modify
                      <PencilLine className='h-5 w-5' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClientDetailGoalsPage;
