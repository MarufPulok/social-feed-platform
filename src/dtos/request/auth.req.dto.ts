import { z } from "zod";

/**
 * Zod schema for user registration request
 */
export const registerReqSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim(),
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
