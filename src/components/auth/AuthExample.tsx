/**
 * Example component demonstrating authentication usage
 * This file serves as a reference - not meant to be used directly in the app
 */

"use client";

import { useAuth, useLogin, useLogout, useRegister } from "@/hooks/useAuthQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginReqSchema, registerReqSchema } from "@/dtos/request/auth.req.dto";
import { z } from "zod";

// Example 1: Using the combined useAuth hook
export function UserProfile() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      <p>Verified: {user?.isEmailVerified ? "Yes" : "No"}</p>
    </div>
  );
}

// Example 2: Login form with mutation
export function QuickLoginForm() {
  const loginMutation = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginReqSchema>>({
    resolver: zodResolver(loginReqSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginReqSchema>) => {
    try {
      await loginMutation.mutateAsync(data);
      console.log("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

// Example 3: Register form with mutation
export function QuickRegisterForm() {
  const registerMutation = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerReqSchema>>({
    resolver: zodResolver(registerReqSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerReqSchema>) => {
    try {
      await registerMutation.mutateAsync(data);
      console.log("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

// Example 4: Logout button
export function LogoutButton() {
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogout} disabled={logoutMutation.isPending}>
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
}

// Example 5: Conditional rendering based on auth state
export function ConditionalContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>You are logged in!</div>
      ) : (
        <div>You are not logged in</div>
      )}
    </div>
  );
}

// Example 6: Using mutation states for feedback
export function AdvancedLoginForm() {
  const loginMutation = useLogin();
  const { register, handleSubmit } = useForm<z.infer<typeof loginReqSchema>>({
    resolver: zodResolver(loginReqSchema),
  });

  const onSubmit = (data: z.infer<typeof loginReqSchema>) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        console.log("Login successful!");
      },
      onError: (error) => {
        console.error("Login failed:", error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      <input {...register("password")} type="password" />
      
      <button type="submit" disabled={loginMutation.isPending}>
        Login
      </button>
      
      {loginMutation.isError && (
        <div className="error">
          Error: {loginMutation.error?.message}
        </div>
      )}
      
      {loginMutation.isSuccess && (
        <div className="success">Login successful!</div>
      )}
    </form>
  );
}

