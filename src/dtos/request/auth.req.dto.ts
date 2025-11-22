export interface RegisterReqDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface LoginReqDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}
