import { API_ENDPOINTS } from "@/configs/url.config";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Suggested user type
 */
export interface SuggestedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

/**
 * Following user type (same as SuggestedUser)
 */
export type FollowingUser = SuggestedUser;

/**
 * Fetch suggested users
 */
async function getSuggestedUsers(): Promise<ApiResponse<SuggestedUser[]>> {
  const response = await fetch(API_ENDPOINTS.USERS.SUGGESTED, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch suggested users");
  }

  return response.json();
}

/**
 * Fetch following users
 */
async function getFollowingUsers(): Promise<ApiResponse<FollowingUser[]>> {
  const response = await fetch(API_ENDPOINTS.USERS.FOLLOWING, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch following users");
  }

  return response.json();
}

/**
 * Follow a user
 */
async function followUser(userId: string): Promise<ApiResponse<{ userId: string }>> {
  const response = await fetch(API_ENDPOINTS.USERS.FOLLOW(userId), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to follow user");
  }

  return response.json();
}

/**
 * Unfollow a user
 */
async function unfollowUser(userId: string): Promise<ApiResponse<{ userId: string }>> {
  const response = await fetch(API_ENDPOINTS.USERS.UNFOLLOW(userId), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to unfollow user");
  }

  return response.json();
}

/**
 * Hook to get suggested users
 */
export function useSuggestedUsers() {
  return useQuery({
    queryKey: queryKeys.users.suggested(),
    queryFn: getSuggestedUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get following users
 */
export function useFollowingUsers() {
  return useQuery({
    queryKey: queryKeys.users.following(),
    queryFn: getFollowingUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to follow a user
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.suggested() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.following() });
      toast.success("User followed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to follow user");
    },
  });
}

/**
 * Hook to unfollow a user
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.suggested() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.following() });
      toast.success("User unfollowed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unfollow user");
    },
  });
}
