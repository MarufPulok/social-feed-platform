import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  // Authentication
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Profile Information (optional, can be added later)
  avatar?: string;

  // Social Features
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  friendRequests: {
    sent: mongoose.Types.ObjectId[];
    received: mongoose.Types.ObjectId[];
  };

  // Activity Tracking
  lastLogin?: Date;
  postsCount: number;
  followersCount: number;
  followingCount: number;

  // Account Status
  isActive: boolean;
  isBanned: boolean;
  bannedUntil?: Date;
  deletedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Partial<IUser>;
}

const userSchema = new Schema<IUser>(
  {
    // Authentication
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // Profile Information (optional, can be added later)
    avatar: {
      type: String,
      default: null,
    },

    // Social Features
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: {
      sent: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      received: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    // Activity Tracking
    lastLogin: {
      type: Date,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    bannedUntil: {
      type: Date,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      transform: function (doc, ret: Record<string, unknown>) {
        if (ret.password !== undefined) delete ret.password;
        if (ret.emailVerificationToken !== undefined)
          delete ret.emailVerificationToken;
        if (ret.passwordResetToken !== undefined) delete ret.passwordResetToken;
        if (ret.passwordResetExpires !== undefined)
          delete ret.passwordResetExpires;
        if (ret.__v !== undefined) delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ "friendRequests.received": 1 });
userSchema.index({ deletedAt: 1 });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update counts when followers/following change
userSchema.pre("save", function () {
  if (this.isModified("followers")) {
    this.followersCount = this.followers.length;
  }
  if (this.isModified("following")) {
    this.followingCount = this.following.length;
  }
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
