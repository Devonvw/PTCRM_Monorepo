"use client";

import DeleteDialog from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPage } from "@/interfaces/page";
import { useAssessments } from "@/stores/useAssessments";
import { IClientGoal, useClientGoals } from "@/stores/useClientGoals";
import { useClients } from "@/stores/useClients";
import { Select } from "@headlessui/react";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ListChecks,
  PencilLine,
  PlusCircle,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PerformAssessmentModal from "../assessments/components/PerformAssessmentModal";
import ClientDetailLayout from "../components/layout";
import CreateUpdateClientGoalModal from "./components/CreateEditClientGoal-Modal";

const ClientGoalsPage = ({ params: { id } }: IPage) => {
  const router = useRouter();
  const {
    getClient,
    loading: clientLoading,
    client,
    filterOptions,
    addModalOpen,
    setAddModalOpen,
    updateClient,
  } = useClients();

  useEffect(() => {
    if (client?.id != +id) getClient(id, true, router.push);
  }, [id]);

  const {
    getClientGoals,
    getClientGoal,
    clientGoal,
    clientGoals,
    addOrUpdateModalOpen,
    setAddOrUpdateModalOpen: setAddOrUpdateModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteClientGoal,
    loading,
  } = useClientGoals();
  const {
    addOrUpdateModalOpen: assessmentModalOpen,
    setAddOrUpdateModalOpen: setAssessmentModalOpen,
  } = useAssessments();

  const [currentPage, setCurrentPage] = useState(0);
  const [show, setShow] = useState("uncompleted");
  const [totalRows, setTotalRows] = useState(0);
  const triggerReload = useRef(false);
  const [stateClientGoal, setClientGoal] = useState<IClientGoal | undefined>(
    undefined
  );
  // const [createOrUpdateModalOpen, setCreateOrUpdateModalOpen] = useState(false);
  const pageSize: number = 4 as const;

  const canGetNextPage = () => {
    return totalRows > pageSize * (currentPage + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setTotalRows(
        await getClientGoals({
          clientId: Number(id),
          pagination: { pageIndex: currentPage, pageSize: pageSize },
          filters: { show },
        })
      );
    };
    fetchData();
  }, [id, currentPage, triggerReload.current]);

  const onCloseCreateOrUpdateModal = () => {
    setAddOrUpdateModalOpen(false);
    setClientGoal(undefined);
    //. Reload the data
    triggerReload.current = !triggerReload.current;
  };
  const onCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    //. Make sure that if the user was on the last page and deleted the last item, the page is set to the previous one
    if (totalRows % pageSize === 1 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    //. Reload the data
    triggerReload.current = !triggerReload.current;
  };
  const onCloseAssessmentModal = () => {
    setAssessmentModalOpen(false);
    //. Reload the data
    triggerReload.current = !triggerReload.current;
  };

  const onShowChange = (e: any) => {
    setShow(e?.target?.value);

    //. Reset the current page to 0
    setCurrentPage(0);
    //. Reload the data
    triggerReload.current = !triggerReload.current;
  };

  const onDelete = async () => {
    await deleteClientGoal(Number(stateClientGoal?.["id"]));
    setDeleteModalOpen(false);
    triggerReload.current = !triggerReload.current;
  };

  return (
    <ClientDetailLayout client={client} loading={clientLoading}>
      <div>
        <CreateUpdateClientGoalModal
          open={addOrUpdateModalOpen}
          onClose={() => onCloseCreateOrUpdateModal()}
          clientId={Number(id)}
          clientGoal={stateClientGoal}
        />
        <DeleteDialog
          objectId={stateClientGoal?.["id"]}
          onClose={() => onCloseDeleteModal()}
          onConfirm={async () => onDelete()}
          open={deleteModalOpen}
          title="Delete client goal"
          message="Are you sure you want to delete this client goal?"
        />

        {/* <DeleteClientGoalModal
          clientGoalId={stateClientGoal?.["id"]}
          open={deleteModalOpen}
          onClose={() => onCloseDeleteModal()}
        /> */}
        <PerformAssessmentModal
          open={assessmentModalOpen}
          onClose={() => onCloseAssessmentModal()}
          clientId={Number(id)}
        />
        <div className="flex justify-between">
          <div className="flex flex-row space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!canGetNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                setCurrentPage(Math.ceil(totalRows / pageSize) - 1);
              }}
              disabled={!canGetNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm h-8 content-center">
              Page {currentPage + 1} of {Math.ceil(totalRows / pageSize)}
            </span>
            <div className="text-sm h-8 content-center">
              <span className=" ms-4 me-2">Show:</span>
              <Select
                onChange={(e) => {
                  onShowChange(e);
                }}
                className="h-full px-2 rounded-md border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              >
                <option value="uncompleted">Uncompleted</option>
                <option value="completed">Completed</option>
                <option value="all">All</option>
              </Select>
            </div>
          </div>
          <div>
            <Button
              size="sm"
              variant="default"
              className="mr-2"
              onClick={() => {
                setAssessmentModalOpen(true);
              }}
            >
              Perform assessment
              <ListChecks className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="light"
              className=""
              onClick={() => {
                setClientGoal(undefined);
                setAddOrUpdateModalOpen(true);
              }}
            >
              Add Client Goal <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 pt-2">
          {loading ? (
            <span>Loading...</span>
          ) : (
            clientGoals.map((cg) => {
              const measurementUnit = cg["goal"]["measurementUnit"];
              return (
                <Card key={cg["id"]}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {cg["goal"]["name"]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="pb-2">
                      {cg["goal"]["description"]}
                    </CardDescription>
                    <div className="grid gap-2 grid-cols-3">
                      <div className="flex flex-col">
                        <span>Started</span>
                        <span className="text-xl font-bold">
                          {cg["startValue"]} {measurementUnit}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span>Currently</span>
                        <span className="text-xl font-bold">
                          {cg["currentValue"]} {measurementUnit}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span>Goal</span>
                        <span className="text-xl font-bold">
                          {cg["completedValue"]} {measurementUnit}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <p className="text-xs text-muted-foreground pt-2 items-center flex">
                        {cg?.progress}% of goal reached
                      </p>
                      <div>
                        <Button
                          className="mt-2"
                          variant={"destructive"}
                          type="button"
                          onClick={() => {
                            console.log("cg", cg);
                            setClientGoal(cg);
                            setDeleteModalOpen(true);
                          }}
                          size="sm"
                        >
                          Delete
                          <Trash className="h-5 w-5" />
                        </Button>
                        {/* <Button
                        className='mt-2 ms-2'
                        variant={"primary"}
                        type='button'
                        onClick={() => {
                          setClientGoal(cg);
                          setDeleteModalOpen(true);
                        }}
                        size='sm'
                      >
                        Assess
                        <Check className='h-5 w-5' />
                      </Button> */}
                        <Button
                          variant="outline"
                          className="mt-2 ms-2"
                          type="button"
                          onClick={() => {
                            setClientGoal(cg);
                            setAddOrUpdateModalOpen(true);
                          }}
                          size="sm"
                        >
                          Modify
                          <PencilLine className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </ClientDetailLayout>
  );
};

export default ClientGoalsPage;
