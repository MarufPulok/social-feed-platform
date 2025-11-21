"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import LoadingOverlay from "@/components/common/loader/LoadingOverlay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onHttpError = (error: any, _v: any, _c: any, mutation: any) => {
  if (mutation?.options?.onError) return;
  return toast.error(error.response?.data?.message || error.message);
};

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: onHttpError,
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000,
    },
  },
});

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
        />
        <NextTopLoader color={"#111827"} showSpinner={false} />
        <LoadingOverlay />
      </SessionProvider>
    </QueryClientProvider>
  );
}

