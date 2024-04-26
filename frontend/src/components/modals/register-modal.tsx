"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IModal } from "@/interfaces/modal";

const formSchema: any = z.object({
  email: z.string().email("This is not a valid email."),
  firstname: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastname: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  password: z.string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(255, { message: "Password cannot be more than 255 characters." }),
  passwordConfirm: z.string().refine((data) => data === formSchema.password, { message: "Passwords do not match." }),
  dateOfBirth: z.date(),
});


const RegisterModal = ({ open, onOpenChange }: IModal) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      passwordConfirm: "",
      dateOfBirth: new Date(),
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    //. Call the signup function
    console.log(data);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-fit flex flex-col">
        <DialogHeader>
          <DialogTitle className="uppercase font-black text-6xl text-gray-100 text-center block">PT<span className="font-thin">CRM</span></DialogTitle>
          <hr className="m-4"></hr>
          <DialogDescription className="text-4xl text-center block">
            Sign up
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-4 gap-y-2">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} type="email" />
                </FormControl>

              </FormItem>
            )} />
            <FormField control={form.control} name="firstname" render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input placeholder="Firstname" {...field} type="text" />
                </FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="lastname" render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input placeholder="Lastname" {...field} type="text" />
                </FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} type="password" />
                </FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="passwordConfirm" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} type="password" />
                </FormControl>
              </FormItem>
            )} />

            <Button className="w-full mt-8 col-span-2" type="submit">Register</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterModal;