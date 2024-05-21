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
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InfoBox from "../app/_components/infoBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePayments } from "@/stores/usePayments";
import { useAuth } from "@/stores/useAuth";

const formSchema: any = z
  .object({
    email: z.string().email("This is not a valid email."),
    firstname: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastname: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(255, { message: "Password cannot be more than 255 characters." }),
    passwordConfirm: z.string(),
    dateOfBirth: z.date(),
    company: z
      .string()
      .min(3, {
        message: "Company name must be at least 3 characters.",
      })
      .max(255, {
        message: "Company name cannot be more than 255 characters.",
      }),
    subscription: z.string(),
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
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export function Signup() {
  const { subscriptions, getSubscriptions } = usePayments();
  const { signUp, infoMessage } = useAuth();
  const { push } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      passwordConfirm: "",
      dateOfBirth: new Date(),
      company: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>): Promise<void> {
    signUp(data, push);
  }

  useEffect(() => {
    getSubscriptions();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container px-4 flex flex-col items-center justify-center min-h-screen relative">
        <div className="flex justify-center items-center shadow-lg shadow-slate-800 w-full fixed top-0 bg-slate-900">
          <nav className="flex container px-4 w-full items-center justify-between py-4 z-50">
            <Link
              href="/"
              className="uppercase font-black text-3xl text-gray-100"
            >
              PT<span className="font-thin">CRM</span>
            </Link>
            <div className="flex gap-x-2">
              <Link
                href="/login"
                className="bg-primary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-secondary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80"
              >
                Signup
              </Link>
            </div>
          </nav>
        </div>
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-x-4 gap-y-2 w-fit dark:bg-slate-950 p-6 border dark:border-slate-800 rounded-lg mt-20 z-[10000]"
            >
              <div className="w-full flex flex-col col-span-2">
                <span className="uppercase font-black text-6xl text-gray-100 text-center">
                  PT<span className="font-thin">CRM</span>
                </span>
                <hr className="m-4"></hr>
                <span className="text-4xl text-center text-gray-300">
                  Sign up
                </span>
              </div>
              <InfoBox extraClasses="col-span-2 w-full" {...infoMessage} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          {...field}
                          type="text"
                        />
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subscription"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Subscription</FormLabel>

                    <FormMessage />
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="max-w-md flex flex-col gap-8 pt-2"
                    >
                      {subscriptions.map((subscription: any, index: number) => (
                        <FormItem key={index}>
                          <FormLabel className="[&:has([data-state=checked])>div]:border-secondary">
                            <FormControl>
                              <RadioGroupItem
                                value={`${subscription?.id}`}
                                className="sr-only"
                              />
                            </FormControl>
                            <span className="text-white block w-full py-2 text-start font-normal">
                              {subscription.name}
                            </span>
                            <div className="items-center rounded-md border-2 border-gray-600 p-1 hover:border-accent">
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
              <Button className="w-full mt-8 col-span-2" type="submit">
                Register
              </Button>
            </form>
          </Form>
        </div>
        <Image
          src={require("@/app/assets/personal-trainer.svg")}
          alt="Personal trainer"
          className="absolute bottom-0 right-0 w-1/3 -z-10"
        />
        <Image
          src={require("@/app/assets/personal-training.svg")}
          alt="Personal training"
          className="absolute bottom-0 left-0 w-1/3 -z-10"
        />
      </div>
    </main>
  );
}

export default Signup;
