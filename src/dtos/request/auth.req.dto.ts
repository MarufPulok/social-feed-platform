/**
 * Request DTO for user registration
 */
export interface RegisterReqDto {
  /** User's email address (must be valid email format) */
  email: string;
  /** User's password (minimum 6 characters, maximum 128 characters) */
  password: string;
}
/**
 * Request DTO for user login
 */
export interface LoginReqDto {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Optional: If true, extends cookie expiration to 7 days */
  rememberMe?: boolean;
}
