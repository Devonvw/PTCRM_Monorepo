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
import { BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { useClients } from "@/stores/useClients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
});

const NewClientSignUpForm = () => {
  const router = useRouter();
  const { createClientSignUp } = useClients();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createClientSignUp(values, router.push.bind(null, "/app/clients"));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8 gap-8 max-w-2xl"
      >
        <div className="grid md:grid-cols-2 gap-y-2 gap-x-4 h-fit">
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
                  <Input type="email" placeholder="Email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:col-span-3 flex">
          <Button type="submit" size="sm" className="ml-auto">
            Save and send sign up email
            <BadgeCheck className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewClientSignUpForm;
