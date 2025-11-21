import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { QUERYKEYS } from "@/lib/constants/query-keys";
import { LoginRequest, RegisterRequest } from "@/lib/dtos/request/auth.req";
import authService from "@/lib/services/auth.service";

export default function useAuthAction() {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Account created successfully! Please login.");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create account");
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      router.push("/feed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to login");
    },
  });

  return {
    registerMutation,
    loginMutation,
  };
}

