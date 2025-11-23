import { z } from "zod";

/**
 * Valid reaction types
 */
export const reactionTypes = ["like", "haha", "love", "angry"] as const;

/**
 * Target types for reactions
 */
export const reactionTargetTypes = ["post", "comment"] as const;

/**
 * Zod validation schema for toggling a reaction
 */
export const toggleReactionSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(reactionTargetTypes, {
    errorMap: () => ({ message: "Target type must be either 'post' or 'comment'" }),
  }),
  type: z.enum(reactionTypes, {
    errorMap: () => ({ message: "Reaction type must be 'like', 'haha', 'love', or 'angry'" }),
  }),
});

/**
 * Zod validation schema for getting reaction users
 */
export const getReactionUsersSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(reactionTargetTypes, {
    errorMap: () => ({ message: "Target type must be either 'post' or 'comment'" }),
  }),
  reactionType: z.enum(reactionTypes).optional(),
});

// Export type inference
export type ToggleReactionData = z.infer<typeof toggleReactionSchema>;
export type GetReactionUsersData = z.infer<typeof getReactionUsersSchema>;
export type ReactionType = typeof reactionTypes[number];
export type ReactionTargetType = typeof reactionTargetTypes[number];
