"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import axios from "axios";
import { Metadata } from "next";
import { IPage } from "@/interfaces/page";
import { useClients } from "@/stores/useClients";
import { Suspense, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { BadgeCheck, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ClientInformationForm from "./information-form";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email("This is not a valid email.").min(2, {
    message: "Email must be at least 2 characters.",
  }),
  street: z.string().min(2, {
    message: "Street must be at least 2 characters.",
  }),
  housenumber: z.string().min(1, {
    message: "House number must be at least 1 character.",
  }),
  housenumberExtra: z.string().optional(),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  zipCode: z.string().min(2, {
    message: "Zip code must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
});

// const getData = async (id: string) => {
//   const { data } = await axios.get(`/backend/clients/${id}`);
//   return data;
// };

const ClientDetailInformationPage = ({ params: { id } }: IPage) => {
  const {
    getClient,
    loading,
    client,
    filterOptions,
    addModalOpen,
    setAddModalOpen,
    updateClient,
  } = useClients();

  useEffect(() => {
    if (client?.id != id) getClient(id);
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      housenumber: "",
      housenumberExtra: "",
      city: "",
      zipCode: "",
      country: "",
    },
    // defaultValues: client,
  });

  useEffect(() => {
    form.reset(client);
  }, [client]);

  // // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    updateClient(id, values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-y-2 gap-x-4"
      >
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold">Client information</h3>
          <p className="text-sm text-gray-400 mb-2 ">
            Change the client information below.
          </p>
          <Separator className="bg-light/30" />
        </div>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold">Address information</h3>
          <p className="text-sm text-gray-400 mb-2 ">
            Change the client address information below.
          </p>
          <Separator className="bg-light/30" />
        </div>

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input placeholder="Street..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="housenumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>House number</FormLabel>
              <FormControl>
                <Input placeholder="House number..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="housenumberExtra"
          render={({ field }) => (
            <FormItem>
              <FormLabel>House number extra</FormLabel>
              <FormControl>
                <Input placeholder="House number extra..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip code</FormLabel>
              <FormControl>
                <Input placeholder="Zip code..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2 flex gap-x-2 justify-start mt-4">
          <Button type="submit" size="sm">
            Update
            <BadgeCheck className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientDetailInformationPage;
