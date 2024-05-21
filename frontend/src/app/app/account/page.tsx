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
import { useUser } from "@/stores/useUser";
import InfoBox from "../_components/infoBox";
import Link from "next/link";

const formSchema: any = z.object({
  email: z.string().email("This is not a valid email."),
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  company: z
    .string()
    .min(3, {
      message: "Company name must be at least 3 characters.",
    })
    .max(255, {
      message: "Company name cannot be more than 255 characters.",
    }),
});

const AccountPage = () => {
  const { user, status, getLoggedInUser, getUserPaymentStatus } = useUser();

  useEffect(() => {
    getLoggedInUser();
    getUserPaymentStatus();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      street: "",
      housenumber: "",
      housenumberExtra: "",
      city: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    form.reset(user);
  }, [user]);

  // // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // updateClient(id, values);
  }

  return (
    <>
      {!status?.hasMandate && (
        <InfoBox extraClasses="w-full !max-w-full" isError>
          <p>
            The first payment has not been paid yet. To start with PTCRM click{" "}
            <Link
              href={status?.paymentUrl || "/"}
              target="_blank"
              className="text-blue-600 font-semibold hover:underline"
            >
              here
            </Link>{" "}
            to fulfill the payment.
          </p>
        </InfoBox>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-y-2 gap-x-4"
        >
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold">Account information</h3>
            <p className="text-sm text-gray-400 mb-2 ">
              Change your account information below.
            </p>
            <Separator className="bg-light/30" />
          </div>

          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} type="text" />
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
                  <Input placeholder="Email" {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company" {...field} type="text" />
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
    </>
  );
};

export default AccountPage;
