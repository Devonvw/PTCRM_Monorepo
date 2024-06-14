"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { useClientGoals } from "@/stores/useClientGoals";
import { IGoal, useGoals } from "@/stores/useGoals";
import { Select } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

//RESOLVED: For some reason when updating the client goal's start and completed value, the form does not update them, it sets the values to undefined and the form is invalid.
//BY: The issue was that all input fields automatically return a string (all input fields to this), so the values were being set as strings, and the form was expecting numbers. I had to make the fields string fields and add a refine method to the schema to check if the values are numbers and not empty strings.
const formSchema: any = z
  .object({
    goalId: z.number({
      message: "Don't forget to select a goal.",
    }),
    startValue: z
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
    completedValue: z
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
  .refine((data) => data.startValue !== data.completedValue, {
    path: ["completedValue"],
    message: "The start value and completed values cannot be the same.",
  });

interface IProps {
  clientGoal?: any;
  clientId: number;
  onClose: () => void;
  open: boolean;
}

const CreateUpdateClientGoalModal = (props: IProps) => {
  const {
    createClientGoal,
    updateClientGoal,
    getClientGoal,
    getClientGoals,
    addOrUpdateModalOpen,
  } = useClientGoals();
  const { goals, getAllGoals } = useGoals();
  const [totalRows, setTotalRows] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<IGoal | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      setTotalRows(await getAllGoals());
    };
    fetchData();

    if (props.clientGoal) {
      form.setValue("goalId", props.clientGoal?.["goal"]["id"]);
      form.setValue("startValue", props.clientGoal?.["startValue"]);
      form.setValue("completedValue", props.clientGoal?.["completedValue"]);
    } else {
      form.reset({}, { keepValues: false, keepDefaultValues: true });
    }
  }, [props.clientGoal, addOrUpdateModalOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalId: undefined,
      startValue: 0,
      completedValue: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (props.clientGoal) {
      await updateClientGoal({ id: props.clientGoal["id"], ...data });
    } else {
      await createClientGoal({ clientId: props.clientId, ...data });
    }

    props.onClose();
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="mx-8 my-10 bg-inherit">
        <DialogHeader>
          <DialogTitle>
            {props.clientGoal ? "Update" : "Add"} Client Goal
          </DialogTitle>
        </DialogHeader>
        {/* <DialogHeader>
              <DialogTitle className='uppercase font-black text-6xl text-gray-100 text-center block'>
                PT<span className='font-thin'>CRM</span>
              </DialogTitle>
              <hr className='m-4'></hr>
              <span className='text-4xl text-center block'>Login</span>
            </DialogHeader> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-8 gap-8 max-w-2xl"
          >
            {/* {!props.clientGoal && ( */}
            <div>
              <FormField
                control={form.control}
                name="goalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <br />
                    <FormControl>
                      <Select
                        className="py-1 px-2 h-10 text-sm rounded-md border dark:border-slate-800 dark:bg-slate-950 w-full"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const selectedValue = +e.target.value;
                          field.onChange(selectedValue);
                          const selectedGoal = goals.find(
                            (goal) => goal["id"] === selectedValue
                          );
                          setSelectedGoal(selectedGoal);
                        }}
                      >
                        <option value="" hidden disabled>
                          Select a goal...
                        </option>
                        {goals.map((goal) => (
                          <option key={goal["id"]} value={goal["id"]}>
                            {goal["name"]}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              {selectedGoal && (
                <p className="pt-4 w-80 text-xs">
                  {selectedGoal?.["description"]}
                </p>
              )}
            </div>
            {/* )} */}
            <FormField
              control={form.control}
              name="startValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Start value..."
                    />
                  </FormControl>
                  <FormDescription>
                    What is the client&apos;s starting value?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
                  control={form.control}
                  name='currentValue'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current value</FormLabel>
                      <FormControl>
                        <Input placeholder='Current value...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
            <FormField
              control={form.control}
              name="completedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completed value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Completed value..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What is the value the client would like to achieve?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-6 justify-end md:col-span-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" size="sm">
                  Cancel
                  <XCircle className="h-5 w-5" />
                </Button>
              </DialogClose>
              <Button type="submit" size="sm">
                {props.clientGoal ? (
                  <>
                    Update <BadgeCheck className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    Add <BadgeCheck className="h-5 w-5" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateClientGoalModal;
