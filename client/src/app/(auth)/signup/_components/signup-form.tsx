"use client";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import axios from "axios";
import { SignupFormData, signupSchema } from "@/lib/schemas";

export default function SignupForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, fetchUser, logout } = useAuthStore();

  React.useEffect(() => {
    logout();
  }, [logout]);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormData) => {
    try {
      setIsLoading(true);
      const res = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Extract tokens from response
      const { accessToken, refreshToken } = res.data.data;

      // Store tokens in Zustand store
      login({ accessToken, refreshToken });

      // Fetch user data
      await fetchUser();

      toast.success(res.data.message);

      // Small delay to ensure auth state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to callback URL if it exists, otherwise go to home
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
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
                <Input type="email" placeholder="Enter your email" {...field} />
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
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    placeholder="**********"
                    className="pl-10 pr-12"
                  />
                  <Button
                    variant={"secondary"}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
