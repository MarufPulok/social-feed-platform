import { API_ENDPOINTS } from "@/configs/url.config";
import { ApiResponse } from "@/dtos/response/common.res.dto";
import { queryKeys } from "@/lib/query-keys";
import { CreateCommentFormData } from "@/validators/comment.validator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Comment interface
 */
export interface Comment {
  _id: string;
  content: string;
  image?: string;
  imagePublicId?: string;
  postId: string;
  parentId?: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  reactions: {
    userId: string;
    type: "like" | "haha" | "love" | "angry";
  }[];
  reactionsCount: number;
  repliesCount: number;
  currentUserReaction?: "like" | "haha" | "love" | "angry";
  replies?: Comment[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch comments for a post
 */
async function fetchComments(postId: string, page = 1, limit = 10): Promise<ApiResponse<Comment[]>> {
  const response = await fetch(
    `${API_ENDPOINTS.COMMENTS.LIST}?postId=${postId}&page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch comments");
  }

  return response.json();
}

/**
 * Create a new comment or reply
 */
async function createComment(data: {
  content: string;
  postId: string;
  parentId?: string;
  image?: string;
  imagePublicId?: string;
}): Promise<ApiResponse<Comment>> {
  const response = await fetch(API_ENDPOINTS.COMMENTS.CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create comment");
  }

  return response.json();
}

/**
 * Delete a comment
 */
async function deleteComment(commentId: string): Promise<ApiResponse<{
  commentId: string;
  hasReplies: boolean;
  message: string;
}>> {
  const response = await fetch(API_ENDPOINTS.COMMENTS.DELETE(commentId), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete comment");
  }

  return response.json();
}

/**
 * Hook to fetch comments for a post
 */
export function useComments(postId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.comments.list(postId, String(page)),
    queryFn: () => fetchComments(postId, page, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!postId,
  });
}

/**
 * Hook to create a comment or reply
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      // Invalidate comments query for the post (all pages)
      queryClient.invalidateQueries({ 
        queryKey: [...queryKeys.comments.all, "list", variables.postId] 
      });
      
      // Invalidate posts query to update comment count
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      
      // Invalidate posts query to update comment count
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}
