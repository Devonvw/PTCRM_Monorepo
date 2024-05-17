"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useClientGoals } from "@/stores/useClientGoals";
import { useGoals } from "@/stores/useGoals";
import { Dialog, Select } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  goal: z.number({
    message: "Don't forget to select a goal.",
  }),
  startValue: z.number({
    message: "Don't forget to fill in the start value.",
  }),
  currentValue: z.number({
    message: "Don't forget to fill in the current value.",
  }),
  completedValue: z.number({
    message: "Don't forget to fill in the completed value.",
  }),
});

interface IProps {
  clientGoalId?: number;
  onClose: () => void;
  open: boolean;
}

const CreateUpdateClientGoalModal = (props: IProps) => {
  const { createClientGoal, updateClientGoal } = useClientGoals();
  const { goals, getGoals } = useGoals();
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setTotalRows(
        await getGoals({
          pagination: [0, 100],
        })
      );
    };
    fetchData();
    console.log("goals", goals);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (props.clientGoalId) {
      updateClientGoal({ id: props.clientGoalId, ...values });
    }
    createClientGoal(values);
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div className='w-full h-full flex justify-center z-50 absolute  top-0'>
        <div className='modal  w-fit bg-slate-600 border rounded-2xl dark:border-slate-800 dark:bg-slate-950 h-fit m-auto relative'>
          <Dialog.Panel className='mx-8 my-10 bg-inherit'>
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
                <FormField
                  control={form.control}
                  name='goal'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal</FormLabel>
                      <br />
                      <FormControl>
                        <Select
                          className='py-1 px-2 h-10 text-sm rounded-md border dark:border-slate-800 dark:bg-slate-950 w-full'
                          {...field}
                          value={field?.value?.toString()}
                        >
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
                <FormField
                  control={form.control}
                  name='startValue'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start value</FormLabel>
                      <FormControl>
                        <Input placeholder='Start value...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
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
                />
                <FormField
                  control={form.control}
                  name='completedValue'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completed value</FormLabel>
                      <FormControl>
                        <Input placeholder='Completed value...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateUpdateClientGoalModal;
