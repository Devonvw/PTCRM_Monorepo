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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InfoBox from "../app/_components/infoBox";

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
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export function Signup() {
  const [infoMessage, setInfoMessage] = useState<[string, boolean] | undefined>(
    undefined
  );
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
    setInfoMessage(undefined);

    try {
      // Create a typed user object based on your formSchema
      const user: z.infer<typeof formSchema> = {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
        company: data.company,
      };

      // Make the signup request with Axios
      const response: AxiosResponse<any> = await axios.post(
        "/backend/auth/signup",
        user
      );

      // Handle successful signup (status code 201)
      if (response.status === 201) {
        setInfoMessage([
          "You have successfully signed up, you can now login",
          false,
        ]);
        // Optionally, handle further logic for successful signup (e.g., redirect)
      } else {
        // Handle errors (non-201 status codes)
        throw new Error(
          response.data.message ||
            "Signup failed. Please check the response data for details."
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong while signing you up, please try again";
      setInfoMessage([errorMessage, true]); // Set error message and error flag
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center'>
      <div className='container px-4 flex flex-col items-center justify-center min-h-screen relative'>
        <div className='flex justify-center items-center shadow-lg shadow-slate-800 w-full fixed top-0'>
          <nav className='flex container px-4 w-full items-center justify-between py-4 z-50'>
            <Link
              href='/'
              className='uppercase font-black text-3xl text-gray-100'
            >
              PT<span className='font-thin'>CRM</span>
            </Link>
            <div className='flex gap-x-2'>
              <Link
                href='/login'
                className='bg-primary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80'
              >
                Login
              </Link>
              <Link
                href='/signup'
                className='bg-secondary text-white py-1 px-5 rounded font-semibold text-lg hover:bg-primary/80'
              >
                Signup
              </Link>
            </div>
          </nav>
        </div>
        <div className=''>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-2 gap-x-4 gap-y-2 w-fit dark:bg-slate-950 p-6 border dark:border-slate-800 rounded-lg -mt-20'
            >
              <div className='w-full flex flex-col col-span-2'>
                <span className='uppercase font-black text-6xl text-gray-100 text-center'>
                  PT<span className='font-thin'>CRM</span>
                </span>
                <hr className='m-4'></hr>
                <span className='text-4xl text-center text-gray-300'>
                  Sign up
                </span>
              </div>
              <InfoBox
                extraClasses='col-span-2'
                message={infoMessage?.[0]}
                isError={infoMessage?.[1]}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email' {...field} type='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firstname</FormLabel>
                    <FormControl>
                      <Input placeholder='Firstname' {...field} type='text' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lastname</FormLabel>
                    <FormControl>
                      <Input placeholder='Lastname' {...field} type='text' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Password'
                        {...field}
                        type='password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='passwordConfirm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Password'
                        {...field}
                        type='password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='company'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder='Company' {...field} type='text' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full mt-8 col-span-2' type='submit'>
                Register
              </Button>
            </form>
          </Form>
        </div>
        <Image
          src={require("@/app/assets/personal-trainer.svg")}
          alt='Personal trainer'
          className='absolute bottom-0 right-0 w-1/3'
        />
        <Image
          src={require("@/app/assets/personal-training.svg")}
          alt='Personal training'
          className='absolute bottom-0 left-0 w-1/3'
        />
      </div>
    </main>
  );
}

export default Signup;
