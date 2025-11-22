/**
 * Request DTO for user registration
 */
export interface RegisterReqDto {
  /** User's email address (must be valid email format) */
  email: string;
  /** User's password (minimum 6 characters, maximum 128 characters) */
  password: string;
}
export interface LoginReqDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}
