import { z } from "zod";

/**
 * Maximum file size for image uploads (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Accepted image MIME types
 */
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Zod validation schema for creating a post
 */
export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content cannot exceed 5000 characters")
    .trim(),
  privacy: z.enum(["public", "private"], {
    errorMap: () => ({ message: "Privacy must be either 'public' or 'private'" }),
  }),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Image size must be less than 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported"
    ),
});

/**
 * Zod validation schema for updating a post
 */
export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content cannot exceed 5000 characters")
    .trim()
    .optional(),
  privacy: z
    .enum(["public", "private"], {
      errorMap: () => ({ message: "Privacy must be either 'public' or 'private'" }),
    })
    .optional(),
});

/**
 * Server-side validation schema for creating a post
 * (doesn't validate File, only string paths)
 */
export const createPostServerSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content cannot exceed 5000 characters")
    .trim(),
  privacy: z.enum(["public", "private"], {
    errorMap: () => ({ message: "Privacy must be either 'public' or 'private'" }),
  }),
  image: z.string().url().optional(),
  imagePublicId: z.string().optional(),
});

// Export type inference for form data
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type CreatePostServerData = z.infer<typeof createPostServerSchema>;

