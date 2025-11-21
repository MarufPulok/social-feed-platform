import { SigninValidation, SignupValidation } from "@/lib/validators/auth.validator";
import { z } from "zod";

export type LoginRequest = z.infer<typeof SigninValidation>;

export type RegisterRequest = z.infer<typeof SignupValidation>;

