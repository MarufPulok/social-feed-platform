import { z } from "zod";

/**
 * Zod validation schema for user registration
 */
export const registerSchema = z
  .object({
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
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must agree to terms & conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Zod validation schema for user login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

// Export type inference for form data
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

