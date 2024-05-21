"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InfoBox from "../app/_components/infoBox";

const formSchema = z.object({
  email: z.string().email("This is not a valid email."),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(255, { message: "Password cannot be more than 255 characters." }),
  remember: z.boolean().optional(),
});

export function Login() {
  const { push } = useRouter();
  const { login, infoMessage } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>): Promise<void> {
    // Typed user object based on formSchema
    const user: z.infer<typeof formSchema> = {
      email: data.email,
      password: data.password,
    };

    await login(user, push);
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container px-4 flex flex-col items-center justify-center min-h-screen relative">
        <div className="flex justify-center items-center shadow-lg shadow-slate-800 w-full fixed top-0">
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
        <div className="w-full max-w-sm dark:bg-slate-950 p-6 border dark:border-slate-800 rounded-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-y-1"
            >
              <span className="uppercase font-black text-6xl text-gray-100 text-center">
                PT<span className="font-thin">CRM</span>
              </span>
              <hr className="m-4"></hr>
              <span className="text-4xl text-center  text-gray-300">Login</span>
              <InfoBox message={infoMessage?.[0]} isError={infoMessage?.[1]} />
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
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button className="w-full mt-8" type="submit">
                Login
              </Button>
            </form>
          </Form>
        </div>
        <Image
          src={require("@/app/assets/personal-trainer.svg")}
          alt="Personal trainer"
          className="absolute bottom-0 right-0 w-1/3"
        />
        <Image
          src={require("@/app/assets/personal-training.svg")}
          alt="Personal training"
          className="absolute bottom-0 left-0 w-1/3"
        />
      </div>
    </main>
  );
}
export default Login;
