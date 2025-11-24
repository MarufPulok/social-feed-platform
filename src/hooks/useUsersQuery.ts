import { API_ENDPOINTS } from "@/configs/url.config";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

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
 * Hook to get suggested users
 */
export function useSuggestedUsers() {
  return useQuery({
    queryKey: queryKeys.users.suggested(),
    queryFn: getSuggestedUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
