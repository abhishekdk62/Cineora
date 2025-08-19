import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  googleId?: string;
  authProvider: "email" | "google";
  avatar?: string;
  locationState?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  isVerified: boolean;
  xpPoints: number;
  updatedAt: Date;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    dateOfBirth: {
      type: Date,
    },
    language: {
      type: String,
      default: "en",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    phone: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      required: false,
      select: false,
      index: true,
    },
    profilePicture: {
      type: String,
    },
    locationCity: {
      type: String,
      trim: true,
    },
    locationState: {
      type: String,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        // default: "Point",
      },
      coordinates: {
        type: [Number], 
        required: false,
        validate: {
          validator: function (v: number[]) {
            return v.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    xpPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, authProvider: 1 });
userSchema.index({ username: 1 });
userSchema.index({ location: "2dsphere" }); // GeoJSON index
userSchema.index({ isActive: 1, lastActive: -1 });

userSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.lastActive = new Date();
  }
  next();
});

export const User = model<IUser>("User", userSchema);
