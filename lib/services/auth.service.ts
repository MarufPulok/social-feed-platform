import { APIUrl } from "@/lib/constants/url.config";
import { LoginRequest, RegisterRequest } from "@/lib/dtos/request/auth.req";
import { AuthResponse } from "@/lib/dtos/response/auth.res";
import httpClientWithoutToken from "@/lib/utils/httpClient";

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await httpClientWithoutToken.post<AuthResponse>(
      APIUrl.auth.signup(),
      data
    );
    return res.data;
  }

  async login(data: LoginRequest) {
    // NextAuth handles login through signIn function
    // This service method is kept for consistency but may not be used directly
    const res = await httpClientWithoutToken.post<AuthResponse>(
      APIUrl.auth.signin(),
      data
    );
    return res.data;
  }
}

const authService = new AuthService();
export default authService;

