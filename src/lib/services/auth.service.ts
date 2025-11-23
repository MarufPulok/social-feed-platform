import { LoginReqDto, RegisterReqDto } from "@/dtos/request/auth.req.dto";
import { LoginResDto, RegisterResDto, UserDto } from "@/dtos/response/auth.res.dto";
import { ApiResponse } from "@/dtos/response/common.res.dto";

/**
 * Authentication service for API calls
 */
export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterReqDto): Promise<UserDto> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result: ApiResponse<RegisterResDto> = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Registration failed");
    }

    return result.data.user;
  },

  /**
   * Login user
   */
  login: async (data: LoginReqDto): Promise<UserDto> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result: ApiResponse<LoginResDto> = await response.json();

    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Login failed");
    }

    return result.data.user;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const result: ApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Logout failed");
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<UserDto | null> => {
    try {
      const response = await fetch("/api/auth/verify", {
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const result: ApiResponse<{ user: UserDto }> = await response.json();

      if (!result.success || !result.data) {
        return null;
      }

      return result.data.user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },
};

