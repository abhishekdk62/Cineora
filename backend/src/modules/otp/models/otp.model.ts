// otp.model.ts
import { Schema, model, Document } from "mongoose";

export type OTPType =
  | "signup"
  | "password_reset"
  | "login"
  | "owner_verification"
  | "owner_email_change"
  | "email_change"
  | "owner_password_reset";

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: OTPType; 
  expiresAt: Date;
  isUsed: boolean;
  userData?: any;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "signup",
        "password_reset",
        "login",
        "owner_verification",
        "email_change",
        "owner_email_change",
        "owner_password_reset",
      ],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    userData: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Good indexing strategy
otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ otp: 1 });
otpSchema.index({ expiresAt: 1 }); 

export const OTP = model<IOTP>("OTP", otpSchema);
