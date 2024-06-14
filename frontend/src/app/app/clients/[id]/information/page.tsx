"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IPage } from "@/interfaces/page";
import { IClient, useClients } from "@/stores/useClients";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ClientDetailLayout from "../components/layout";
import { useRouter } from "next/navigation";

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

const ClientDetailInformationPage = ({ params: { id } }: IPage) => {
  const router = useRouter();
  const { getClient, loading, client, updateClient } = useClients();

  useEffect(() => {
    if (client?.id != +id) getClient(id, true, router.push);
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
  });

  useEffect(() => {
    form.reset(client);
  }, [client]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateClient(id, values as IClient);
  }

  return (
    <ClientDetailLayout client={client} loading={loading}>
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
    </ClientDetailLayout>
  );
};

export default ClientDetailInformationPage;
