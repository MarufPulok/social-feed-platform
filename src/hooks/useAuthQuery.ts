import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginReqDto, RegisterReqDto } from "@/dtos/request/auth.req.dto";
import { UserDto } from "@/dtos/response/auth.res.dto";
import { authService } from "@/lib/services/auth.service";
import { queryKeys } from "@/lib/query-keys";

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Hook to handle user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterReqDto) => authService.register(data),
    onSuccess: (user: UserDto) => {
      // Update the current user query cache
      queryClient.setQueryData(queryKeys.auth.currentUser(), user);
    },
  });
}

/**
 * Hook to handle user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginReqDto) => authService.login(data),
    onSuccess: (user: UserDto) => {
      // Update the current user query cache
      queryClient.setQueryData(queryKeys.auth.currentUser(), user);
    },
  });
}

/**
 * Hook to handle user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
}

/**
 * Combined hook for authentication state and actions
 * This provides a simpler API similar to the old useAuth hook
 */
export function useAuth() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  return {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated: !!user && !isError,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    loginMutation,
    logoutMutation,
    registerMutation,
  };
}

