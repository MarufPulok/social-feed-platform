export interface RegisterReqDto {
  email: string;
  password: string;
}
export interface LoginReqDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}
