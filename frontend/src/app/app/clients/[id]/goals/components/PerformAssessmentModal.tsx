import { DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { useAssessments } from "@/stores/useAssessments";
import { Button, Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  measurements: z.array(
    z.object({
      clientGoalId: z.number({
        message:
          "The client goal id should automatically be set, something has gone wrong... Please try starting a new assessment.",
      }),
      value: z
        .string()
        .refine(
          (value) => {
            let n = Number(value);
            return !isNaN(n) && value?.length > 0;
          },
          { message: "Invalid number" }
        )
        .refine(
          (value) => {
            let n = Number(value);
            let split = value.split(".");
            return (
              n > 0 &&
              n < 9999.9 &&
              (split.length === 1 ? true : split[1].length <= 1)
            );
          },
          {
            message:
              "Only numbers greater than 0, smaller than 9999.9 and with a single decimal point are allowed",
          }
        ),
    })
  ),
  notes: z.string().optional(),
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
  // const { clientGoals, getClientGoals } = useClientGoals();
  const {
    clientGoalsToMeasure,
    getClientGoalsToMeasure,
    initiateAssessment,
    completeAssessment,
    addOrUpdateModalOpen,
  } = useAssessments();

  const [totalClientGoals, setTotalClientGoals] = useState(0);
  const [measurementsToPerform, setMeasurementsToPerform] = useState<
    { clientGoalId: number; value: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      measurements: clientGoalsToMeasure.map((clientGoal: ClientGoal) => ({
        clientGoalId: clientGoal.id,
        value: clientGoal.currentValue.toString(),
      })),
      notes: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const goals = await getClientGoalsToMeasure({
        clientId: props.clientId,
        pagination: [0, 100],
      });
      setTotalClientGoals(goals);

      const measurements = clientGoalsToMeasure.map(
        (clientGoal: ClientGoal) => ({
          clientGoalId: clientGoal.id,
          value: clientGoal.currentValue.toString(),
        })
      );
      setMeasurementsToPerform(measurements);
      form.reset({ measurements });
    };

    fetchData();
  }, [addOrUpdateModalOpen]);

  useEffect(() => {
    form.reset({ measurements: measurementsToPerform });
  }, [measurementsToPerform]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await completeAssessment(props.clientId, data.measurements, data.notes);

    props.onClose();
  }

  return (
    //. Dialog shouldn't close when clicking outside of it, hence the empty onClose function (can only be closed by the cancel or submit button)
    <Dialog open={props.open} onClose={() => {}}>
      <div className='w-full h-full flex justify-center z-50 absolute  top-0'>
        <div className='modal max-w-screen-lg max-h-screen bg-slate-600 border rounded-2xl dark:border-slate-800 dark:bg-slate-950 h-fit m-auto relative'>
          <Dialog.Panel className='mx-8 my-10 bg-inherit'>
            <DialogHeader className='mb-4'>
              <h2 className='text-2xl font-bold text-gray-100'>
                Performing Assessment
              </h2>
              <small className='text-xs font-normal'>
                {totalClientGoals}{" "}
                {totalClientGoals > 1 ? "measurements" : "measurement"} to
                perform
              </small>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-4 mb-4 max-h-96 overflow-y-scroll'>
                  {clientGoalsToMeasure.map(
                    (clientGoal: ClientGoal, index: number) => (
                      // <div key={clientGoal.id}>{clientGoal.id}</div>
                      <FormField
                        control={form.control}
                        key={clientGoal.id}
                        name={`measurements.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{clientGoal.goal.name}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type='number'
                                placeholder={clientGoal.currentValue.toString()}
                                value={field.value || clientGoal.currentValue}
                              />
                            </FormControl>
                            <FormDescription>
                              {clientGoal.goal.howToMeasure}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    )
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <TextArea
                          {...field}
                          className='h-20'
                          placeholder='Notes...'
                        />
                      </FormControl>
                      <FormDescription>
                        Add any notes you would like to save with this
                        assessment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <div className=' flex mt-8 col-span-2 justify-end'>
                  <Button
                    onClick={props.onClose}
                    className='inline-flex gap-x-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 mr-2'
                    type='button'
                  >
                    Cancel
                  </Button>
                  <Button
                    className='inline-flex gap-x-2 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-light text-black hover:bg-light/90 dark:bg-light dark:text-black dark:hover:bg-light/90 rounded-md h-10 px-4 py-2'
                    type='submit'
                  >
                    Save Assessment
                  </Button>
                </div>
              </form>
            </Form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default PerformAssessmentModal;
