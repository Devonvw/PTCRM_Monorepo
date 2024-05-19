import { DialogHeader } from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAssessments } from "@/stores/useAssessments";
import { useClientGoals } from "@/stores/useClientGoals";
import { Dialog, Input } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  measurements: z.array(
    z.object({
      clientGoalId: z.number({
        message:
          "The client goal id should automatically be set, something has gone wrong... Please try starting a new assessment again.",
      }),
      value: z.number({
        message: "Please enter a valid number for the measurement.",
      }),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

interface ClientGoal {
  id: number;
  startValue: number;
  currentValue: number;
  completedValue: number;
  goal: {
    id: number;
    name: string;
    description: string;
    howToMeasure: string;
    unit: string;
  };
}

interface IProps {
  clientId: number;
  onClose: () => void;
  open: boolean;
}

const PerformAssessmentModal = (props: IProps) => {
  const { clientGoals, getClientGoals } = useClientGoals();
  const { initiateAssessment, completeAssessment, addOrUpdateModalOpen } =
    useAssessments();

  const [totalClientGoals, setTotalClientGoals] = useState(0);
  const [measurementsToPerform, setMeasurementsToPerform] = useState<
    { goalId: number; value: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      //. Retrieve all the clients goals for which the assessment can be performed (all uncompleted goals)
      setTotalClientGoals(
        await getClientGoals({
          clientId: props.clientId,
          pagination: [0, 100],
        })
      );
      setMeasurementsToPerform([]);
      // var measurements: { goalId: number; value: number }[] = [];
      clientGoals.forEach((clientGoal: ClientGoal) => {
        measurementsToPerform.push({
          goalId: clientGoal.goal.id,
          value: clientGoal.currentValue,
        });
      });
      console.log("clientGoals", clientGoals);
    };

    fetchData();
  }, [addOrUpdateModalOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      measurements: clientGoals.map((goal: ClientGoal) => ({
        clientGoalId: goal.id,
        value: goal.currentValue,
      })),
    },
  });

  useEffect(
    () => form.reset({ measurements: measurementsToPerform }),
    [measurementsToPerform]
  );

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("data", data);
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div className='w-full h-full flex justify-center z-50 absolute  top-0'>
        <div className='modal  w-fit bg-slate-600 border rounded-2xl dark:border-slate-800 dark:bg-slate-950 h-fit m-auto relative'>
          <Dialog.Panel className='mx-8 my-10 bg-inherit'>
            <DialogHeader>
              <h2 className='text-2xl font-bold text-gray-100'>
                Perform Assessment
              </h2>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                {clientGoals.map((clientGoal: ClientGoal, index: number) => (
                  // <div key={clientGoal.id}>{clientGoal.id}</div>
                  <FormField
                    key={clientGoal.id}
                    name={`measurements[${index}].clientGoalId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{clientGoal.goal.name}</FormLabel>
                        <FormDescription>
                          {clientGoal.goal.howToMeasure}
                        </FormDescription>
                        <FormControl>
                          <Input
                            {...field}
                            type='number'
                            placeholder={clientGoal.currentValue.toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                ))}
              </div>
              <button type='submit' className='btn btn-primary'>
                Submit
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default PerformAssessmentModal;
