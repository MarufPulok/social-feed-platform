export interface UserDto {
  id: string;
  email: string;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface RegisterResDto {
  user: UserDto;
}

export interface LoginResDto {
  user: UserDto;
}

export interface VerifyResDto {
  user: UserDto;
}

