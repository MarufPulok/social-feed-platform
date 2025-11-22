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
    LIKE: (id: string) => `${API_BASE_URL}/posts/${id}/like`,
    LIKES: (id: string) => `${API_BASE_URL}/posts/${id}/likes`,
  },
  COMMENTS: {
    CREATE: `${API_BASE_URL}/comments`,
    LIST: (postId: string) => `${API_BASE_URL}/comments/${postId}`,
    LIKE: (id: string) => `${API_BASE_URL}/comments/${id}/like`,
    LIKES: (id: string) => `${API_BASE_URL}/comments/${id}/likes`,
    DELETE: (id: string) => `${API_BASE_URL}/comments/${id}`,
  },
  UPLOAD: {
    IMAGE: `${API_BASE_URL}/upload`,
  },
};
