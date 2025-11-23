import { z } from "zod";

/**
 * Zod schema for user registration request
 */
export const registerReqSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password must be less than 128 characters"),
});

/**
 * Zod schema for user login request
 */
export const loginReqSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

/**
 * Request DTO for user registration (inferred from zod schema)
 */
export type RegisterReqDto = z.infer<typeof registerReqSchema>;

/**
 * Request DTO for user login (inferred from zod schema)
 */
export type LoginReqDto = z.infer<typeof loginReqSchema>;
