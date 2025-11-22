export const QUERYKEYS = {
  auth: {
    getCurrentUser: ["auth", "currentUser"],
  },
  feed: {
    getAllPosts: ["feed", "posts"],
    getPost: (id: string) => ["feed", "posts", id],
    getPostReactions: (id: string) => ["feed", "posts", id, "reactions"],
  },
  comments: {
    getAllComments: (postId: string) => ["comments", postId],
    getComment: (id: string) => ["comments", id],
    getCommentReplies: (id: string) => ["comments", id, "replies"],
  },
  reactions: {
    getReactions: (entityType: string, entityId: string) => ["reactions", entityType, entityId],
  },
  stories: {
    getAllStories: ["stories"],
    getStory: (id: string) => ["stories", id],
  },
  notifications: {
    getAllNotifications: ["notifications"],
    getUnreadCount: ["notifications", "unread"],
  },
  friends: {
    getAllFriends: ["friends"],
    getSuggestedFriends: ["friends", "suggested"],
  },
  search: {
    search: (query: string) => ["search", query],
  },
} as const;

