"use client";
import { IModal } from "@/interfaces/modal";
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
import { BadgeCheck, XCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useClients } from "@/stores/useClients";
import { IReload } from "@/interfaces/reload";
import PageHeader from "@/components/ui/page-header";
import { usePayments } from "@/stores/usePayments";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  firstName: z.string({
    message: "Don't forget to fill in the clients first name.",
  }),
  lastName: z.string({
    message: "Don't forget to fill in the clients last name.",
  }),
  email: z
    .string({
      message: "Don't forget to fill in the clients email.",
    })
    .email("This is not a valid email."),
  street: z.string({
    message: "Don't forget to fill in the clients streetname.",
  }),
  housenumber: z.string({
    message: "Don't forget to fill in the clients housenumber.",
  }),
  housenumberExtra: z.string().optional(),
  city: z.string({
    message: "Don't forget to fill in the clients city.",
  }),
  zipCode: z.string({
    message: "Don't forget to fill in the clients zip code.",
  }),
  country: z.string({
    message: "Don't forget to fill in the clients country.",
  }),
  subscription: z.number(),
});

const NewClient = () => {
  const { createClient } = useClients();
  const { subscriptions, getMySubscriptions } = usePayments();

  useEffect(() => {
    getMySubscriptions();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // firstName: "",
      // lastName: "",
      // email: "",
      // street: "",
      // housenumber: "",
      // housenumberExtra: "",
      // city: "",
      // zipCode: "",
      // country: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    createClient(values);
  }

  return (
    <div>
      <PageHeader
        title="New client"
        breadcrumbs={[
          { title: "Clients", href: "/app/clients" },
          { title: "New client" },
        ]}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-3 gap-y-8 gap-8"
        >
          <div className="grid md:grid-cols-2 col-span-2 gap-y-2 gap-x-4 h-fit">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold">Client information</h3>

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

              <Separator className="bg-light/30" />
            </div>
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Streetname</FormLabel>
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
          </div>
          <div className="bg-slate-800 rounded p-4">
            <FormField
              control={form.control}
              name="subscription"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xl font-semibold">
                    Subscription
                  </FormLabel>

                  <FormMessage />
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="max-w-md flex flex-col gap-8 pt-2"
                  >
                    {subscriptions.map((subscription, index) => (
                      <FormItem key={index}>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-green-600">
                          <FormControl>
                            <RadioGroupItem
                              value={subscription?.id}
                              className="sr-only"
                            />
                          </FormControl>
                          <span className="text-white block w-full p-2 text-center font-normal">
                            {subscription.name}
                          </span>
                          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="rounded-sm font-light p-2">
                              <p className="text-white text-base">
                                <span className="font-bold">
                                  {subscription?.sessionsPerWeek}
                                </span>{" "}
                                sessions per week
                              </p>
                              <p className="text-white text-base">
                                <span className="font-bold">
                                  €{subscription?.totalPrice}
                                </span>{" "}
                                per 4 weeks
                              </p>
                              <p className="text-gray-300 font-light mt-3">
                                {subscription?.description}
                              </p>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-3 flex">
            <Button type="submit" size="sm" className="ml-auto">
              Save and send payment email
              <BadgeCheck className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewClient;
