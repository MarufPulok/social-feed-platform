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
 * Zod validation schema for creating a comment or reply
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(2000, "Comment cannot exceed 2000 characters")
    .trim(),
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional(), // For replies
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
 * Server-side validation schema for creating a comment
 * (doesn't validate File, only string paths)
 */
export const createCommentServerSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(2000, "Comment cannot exceed 2000 characters")
    .trim(),
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional(),
  image: z.string().url().optional(),
  imagePublicId: z.string().optional(),
});

/**
 * Zod validation schema for updating a comment
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(2000, "Comment cannot exceed 2000 characters")
    .trim()
    .optional(),
});

// Export type inference for form data
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type CreateCommentServerData = z.infer<typeof createCommentServerSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
