import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  // Content
  content: string;
  image?: string; // Cloudinary URL
  imagePublicId?: string; // Cloudinary public ID for deletion

  // References
  postId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId; // For replies (self-reference)
  author: mongoose.Types.ObjectId;

  // Engagement
  reactions: {
    userId: mongoose.Types.ObjectId;
    type: "like" | "haha" | "love" | "angry";
  }[];
  reactionsCount: number;
  repliesCount: number;

  // Status
  isDeleted: boolean;
  deletedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post ID is required"],
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["like", "haha", "love", "angry"],
          required: true,
        },
      },
    ],
    reactionsCount: {
      type: Number,
      default: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: Record<string, unknown>) {
        if (ret.__v !== undefined) delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ isDeleted: 1 });

// Update reactions count when reactions array changes
commentSchema.pre("save", function () {
  if (this.isModified("reactions")) {
    this.reactionsCount = this.reactions.length;
  }
});

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;

