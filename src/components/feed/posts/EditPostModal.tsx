"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdatePost } from "@/hooks/usePostsQuery";
import { CreatePostFormData, createPostSchema } from "@/validators/post.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    _id: string;
    content: string;
    privacy: "public" | "private";
  };
}

export default function EditPostModal({ isOpen, onClose, post }: EditPostModalProps) {
  const updatePostMutation = useUpdatePost();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: post.content,
      privacy: post.privacy,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        content: post.content,
        privacy: post.privacy,
      });
    }
  }, [isOpen, post, reset]);

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await updatePostMutation.mutateAsync({
        postId: post._id,
        data: {
          content: data.content,
          privacy: data.privacy || "public",
        },
      });
      toast.success("Post updated successfully");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update post");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-4">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-3">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <textarea
                className={`flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.content ? "border-red-500" : ""
                }`}
                placeholder="What's on your mind?"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="privacy" className="text-sm font-medium">
                Privacy
              </label>
              <select
                id="privacy"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("privacy")}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <DialogFooter
          className="flex justify-between gap-2"
          >
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
