/**
 * Centralized React Query keys for type-safe query management
 * Following best practices for query key structure
 */

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "current-user"] as const,
  },
  posts: {
    all: ["posts"] as const,
    list: (cursor?: string) =>
      [...queryKeys.posts.all, "list", { cursor }] as const,
    detail: (id: string) => [...queryKeys.posts.all, "detail", id] as const,
  },
  comments: {
    all: ["comments"] as const,
    list: (postId: string, cursor?: string) =>
      [...queryKeys.comments.all, "list", { postId, cursor }] as const,
  },
  reactions: {
    all: ["reactions"] as const,
    users: (targetId: string, targetType: string) =>
      [...queryKeys.reactions.all, "users", { targetId, targetType }] as const,
  },
} as const;


