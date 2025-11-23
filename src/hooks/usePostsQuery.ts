import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/configs/url.config";
import { queryKeys } from "@/lib/query-keys";
import { ApiResponse } from "@/dtos/response/common.res.dto";

/**
 * Reaction type enum
 */
export type ReactionType = "like" | "haha" | "love" | "angry";

/**
 * Post interface
 */
export interface Post {
  _id: string;
  content: string;
  image?: string;
  imagePublicId?: string;
  privacy: "public" | "private";
  author: {
    _id: string;
    email: string;
    avatar?: string;
  };
  reactions: {
    userId: string;
    type: ReactionType;
  }[];
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
  currentUserReaction?: ReactionType;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch posts from the API
 */
async function fetchPosts(page = 1, limit = 10): Promise<ApiResponse<Post[]>> {
  const response = await fetch(
    `${API_ENDPOINTS.POSTS.LIST}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch posts");
  }

  return response.json();
}

/**
 * Create a new post
 */
async function createPost(data: {
  content: string;
  privacy: "public" | "private";
  image?: string;
  imagePublicId?: string;
}): Promise<ApiResponse<Post>> {
  const response = await fetch(API_ENDPOINTS.POSTS.CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create post");
  }

  return response.json();
}

/**
 * Upload image to Cloudinary
 */
async function uploadImage(file: File, type: "post" | "profile" | "comment" = "post") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await fetch(API_ENDPOINTS.UPLOAD.IMAGE, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload image");
  }

  const result: ApiResponse<{
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
  }> = await response.json();

  return result.data;
}

/**
 * Hook to fetch posts
 */
export function usePosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.posts.list(String(page)),
    queryFn: () => fetchPosts(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate posts query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}

/**
 * Hook to upload an image
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type?: "post" | "profile" | "comment" }) =>
      uploadImage(file, type),
  });
}

/**
 * React to a post
 */
async function reactToPost(
  postId: string,
  reactionType: ReactionType
): Promise<ApiResponse<Post>> {
  const response = await fetch(API_ENDPOINTS.POSTS.REACT(postId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ type: reactionType }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to react to post");
  }

  return response.json();
}

/**
 * Hook to react to a post
 */
export function useReactToPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, type }: { postId: string; type: ReactionType }) =>
      reactToPost(postId, type),
    onSuccess: () => {
      // Invalidate posts query to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}

