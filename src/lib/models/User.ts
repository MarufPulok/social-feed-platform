import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  // Authentication
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for OAuth users
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // OAuth fields
  googleId?: string;
  authProvider: "local" | "google";

  // Profile Information (optional, can be added later)
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;

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
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.authProvider === "local";
      },
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

    // OAuth fields
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values but unique non-null values
      unique: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
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
// Note: email and googleId indexes are automatically created by unique: true
userSchema.index({ "friendRequests.received": 1 });
userSchema.index({ deletedAt: 1 });

// Hash password before saving (only for local auth)
userSchema.pre("save", async function () {
  const user = this as unknown as IUser;
  // Only hash password if it's modified and user is using local auth
  if (
    !this.isModified("password") ||
    user.authProvider !== "local" ||
    !user.password
  ) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
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
  const user = this as unknown as IUser;
  if (this.isModified("followers")) {
    user.followersCount = user.followers.length;
  }
  if (this.isModified("following")) {
    user.followingCount = user.following.length;
  }
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
