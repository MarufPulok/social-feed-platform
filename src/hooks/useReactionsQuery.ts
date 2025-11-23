import { API_ENDPOINTS } from "@/configs/url.config";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Comment } from "./useCommentsQuery";
import { Post } from "./usePostsQuery";

/**
 * Reaction types
 */
export type ReactionType = "like" | "haha" | "love" | "angry";

/**
 * Reaction users grouped by type
 */
export interface ReactionUsers {
  reactions: {
    like: Array<{ _id: string; email: string; avatar?: string }>;
    haha: Array<{ _id: string; email: string; avatar?: string }>;
    love: Array<{ _id: string; email: string; avatar?: string }>;
    angry: Array<{ _id: string; email: string; avatar?: string }>;
  };
  summary: {
    total: number;
    byType: {
      like: number;
      haha: number;
      love: number;
      angry: number;
    };
  };
}

/**
 * Toggle reaction on a post or comment
 */
async function toggleReaction(data: {
  targetId: string;
  targetType: "post" | "comment";
  type: ReactionType;
}): Promise<ApiResponse<Post | Comment>> {
  const response = await fetch(API_ENDPOINTS.REACTIONS.TOGGLE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to toggle reaction");
  }

  return response.json();
}

/**
 * Get users who reacted to a post or comment
 */
async function getReactionUsers(
  targetId: string,
  targetType: "post" | "comment",
  reactionType?: ReactionType
): Promise<ApiResponse<ReactionUsers>> {
  const params = new URLSearchParams({
    targetType,
  });

  if (reactionType) {
    params.append("reactionType", reactionType);
  }

  const response = await fetch(
    `${API_ENDPOINTS.REACTIONS.USERS(targetId)}?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch reaction users");
  }

  return response.json();
}

/**
 * Hook to toggle a reaction
 */
export function useToggleReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReaction,
    onSuccess: (data, variables) => {
      if (variables.targetType === "post") {
        // Invalidate posts queries
        queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
        
        // Invalidate reactions users for this post
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.reactions.users(variables.targetId, "post") 
        });
      } else {
        // Invalidate comments queries
        queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
        
        // Invalidate reactions users for this comment
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.reactions.users(variables.targetId, "comment") 
        });
      }
    },
  });
}

/**
 * Hook to get users who reacted
 */
export function useReactionUsers(
  targetId: string,
  targetType: "post" | "comment",
  reactionType?: ReactionType
) {
  return useQuery({
    queryKey: queryKeys.reactions.users(targetId, targetType),
    queryFn: () => getReactionUsers(targetId, targetType, reactionType),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: !!targetId && !!targetType,
  });
}
