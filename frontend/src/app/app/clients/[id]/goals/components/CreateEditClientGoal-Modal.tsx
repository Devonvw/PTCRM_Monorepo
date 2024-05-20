"use client";

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
import { useClientGoals } from "@/stores/useClientGoals";
import { useGoals } from "@/stores/useGoals";
import { Button, Dialog, Select } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { goals, getGoals } = useGoals();
  const [totalRows, setTotalRows] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setTotalRows(
        await getGoals({
          pagination: [0, 100],
        })
      );
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
    <Dialog open={props.open} onClose={props.onClose}>
      <div className='w-full h-full flex justify-center z-50 absolute  top-0'>
        <div className='modal  w-fit bg-slate-600 border rounded-2xl dark:border-slate-800 dark:bg-slate-950 h-fit m-auto relative'>
          <Dialog.Panel className='mx-8 my-10 bg-inherit'>
            <DialogHeader>
              <h2 className='text-2xl font-bold text-gray-100'>
                {props.clientGoal ? "Update" : "Add"} Client Goal
              </h2>
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
                className='flex flex-col gap-y-8 gap-8 max-w-2xl'
              >
                {/* {!props.clientGoal && ( */}
                <div>
                  <FormField
                    control={form.control}
                    name='goalId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal</FormLabel>
                        <br />
                        <FormControl>
                          <Select
                            className='py-1 px-2 h-10 text-sm rounded-md border dark:border-slate-800 dark:bg-slate-950 w-full'
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              console.log("current value", field.value);
                              const selectedValue = +e.target.value;
                              field.onChange(selectedValue);
                              const selectedGoal = goals.find(
                                (goal) => goal["id"] === selectedValue
                              );
                              setSelectedGoal(selectedGoal);
                            }}
                          >
                            <option value='' hidden disabled>
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
                    <p className='pt-4 w-80 text-xs'>
                      {selectedGoal?.["description"]}
                    </p>
                  )}
                </div>
                {/* )} */}
                <FormField
                  control={form.control}
                  name='startValue'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start value</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='number'
                          placeholder='Start value...'
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
                  name='completedValue'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completed value</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Completed value...'
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
                    {props.clientGoal ? "Update" : "Create"}
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

export default CreateUpdateClientGoalModal;
