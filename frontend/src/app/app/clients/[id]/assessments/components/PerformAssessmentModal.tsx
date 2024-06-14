import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { IClientGoal } from "@/stores/useClientGoals";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, XCircle } from "lucide-react";
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

interface IProps {
  clientId: number;
  onClose: () => void;
  open: boolean;
}

const PerformAssessmentModal = (props: IProps) => {
  // const { clientGoals, getClientGoals } = useClientGoals();
  const {
    clientGoalsToMeasure,
    getAllUncompletedClientGoals,
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
      measurements: clientGoalsToMeasure.map((clientGoal) => ({
        clientGoalId: clientGoal.id,
        value: clientGoal.currentValue.toString(),
      })),
      notes: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const goals = await getAllUncompletedClientGoals(props.clientId);
      if (goals || goals == 0) setTotalClientGoals(goals);
    };

    fetchData();
  }, [addOrUpdateModalOpen]);

  useEffect(() => {
    const measurements = clientGoalsToMeasure.map((clientGoal) => ({
      clientGoalId: clientGoal.id,
      value: clientGoal.currentValue.toString(),
    }));
    setMeasurementsToPerform(measurements);

    form.reset({ measurements });
  }, [clientGoalsToMeasure]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await completeAssessment(props.clientId, data.measurements, data.notes);

    props.onClose();
  }

  return (
    //. Dialog shouldn't close when clicking outside of it, hence the empty onClose function (can only be closed by the cancel or submit button)
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.onClose();
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Performing Assessment</DialogTitle>
          <DialogDescription>
            ({totalClientGoals}{" "}
            {totalClientGoals > 1 ? "measurements" : "measurement"} to perform)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 mb-4 max-h-112 overflow-y-scroll">
              {clientGoalsToMeasure.map(
                (
                  clientGoal,
                  index // <div key={clientGoal.id}>{clientGoal.id}</div>
                ) => (
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
                            type="number"
                            placeholder={clientGoal.currentValue.toString()}
                            // value={field.value || clientGoal.currentValue}
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
                      className="h-20"
                      placeholder="Notes..."
                    />
                  </FormControl>
                  <FormDescription>
                    Add any notes you would like to save with this assessment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <DialogFooter className="pt-6 justify-end md:col-span-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" size="sm">
                  Cancel
                  <XCircle className="h-5 w-5" />
                </Button>
              </DialogClose>
              <Button type="submit" size="sm">
                Add
                <BadgeCheck className="h-5 w-5" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PerformAssessmentModal;
