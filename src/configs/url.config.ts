export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  POSTS: {
    LIST: `${API_BASE_URL}/posts`,
    CREATE: `${API_BASE_URL}/posts`,
    DETAIL: (id: string) => `${API_BASE_URL}/posts/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/posts/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/posts/${id}`,
    REACT: (id: string) => `${API_BASE_URL}/posts/${id}/react`,
    LIKE: (id: string) => `${API_BASE_URL}/posts/${id}/like`,
    LIKES: (id: string) => `${API_BASE_URL}/posts/${id}/likes`,
  },
  COMMENTS: {
    CREATE: `${API_BASE_URL}/comments`,
    LIST: `${API_BASE_URL}/comments`,
    DELETE: (id: string) => `${API_BASE_URL}/comments/${id}`,
  },
  REACTIONS: {
    TOGGLE: `${API_BASE_URL}/reactions`,
    USERS: (targetId: string) => `${API_BASE_URL}/reactions/${targetId}`,
  },
  UPLOAD: {
    IMAGE: `${API_BASE_URL}/upload`,
  },
  USERS: {
    SUGGESTED: `${API_BASE_URL}/users/suggested`,
    FOLLOW: (userId: string) => `${API_BASE_URL}/users/${userId}/follow`,
    UNFOLLOW: (userId: string) => `${API_BASE_URL}/users/${userId}/unfollow`,
    FOLLOWING: `${API_BASE_URL}/users/following`,
  },
};

