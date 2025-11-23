"use client";

import { useAuth } from "@/hooks/useAuthQuery";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Client-side redirect for authenticated users on auth pages
 * This provides immediate client-side feedback while middleware handles server-side
 */
export function AuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/feed");
    }
  }, [isAuthenticated, isLoading, router]);

  return null;
}

