import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPost extends Document {
  // Content
  content: string;
  image?: string; // Cloudinary URL
  imagePublicId?: string; // Cloudinary public ID for deletion

  // Privacy
  privacy: "public" | "private";

  // Author
  author: mongoose.Types.ObjectId;

  // Engagement
  reactions: {
    userId: mongoose.Types.ObjectId;
    type: "like" | "haha" | "love" | "angry";
  }[];
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;

  // Status
  isDeleted: boolean;
  deletedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      required: true,
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
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
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
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ privacy: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1, createdAt: -1 });

// Update reactions count when reactions array changes
postSchema.pre("save", function () {
  if (this.isModified("reactions")) {
    this.reactionsCount = this.reactions.length;
  }
});

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;

