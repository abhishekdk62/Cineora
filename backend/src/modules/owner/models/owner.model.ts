import { Schema, model, Document, Types } from "mongoose";

export interface IOwner extends Document {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  password?: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  refreshToken:string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;

  kycRequestId: Types.ObjectId; 
  approvedAt: Date;
  approvedBy: string;

  isActive: boolean;
  isVerified: boolean;

  theatres: Types.ObjectId[]; 

  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ownerSchema = new Schema<IOwner>(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    aadhaar: {
      type: String,
      required: true,
    },
    refreshToken: { type: String },

    pan: {
      type: String,
      required: true,
      uppercase: true,
    },
    accountHolder: {
      type: String,
      required: false,
      trim: true,
    },
    bankName: {
      type: String,
      required: false,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: false,
    },
    ifsc: {
      type: String,
      required: false,
      uppercase: true,
    },
    aadhaarUrl: {
      type: String,
      required: true,
    },
    panUrl: {
      type: String,
      required: true,
    },
    ownerPhotoUrl: {
      type: String,
      default: null,
    },

    kycRequestId: {
      type: Schema.Types.ObjectId, 
      ref: "OwnerRequest",
      required: true,
    },
    approvedAt: {
      type: Date,
      required: true,
    },
    approvedBy: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },

    theatres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Theatre",
      },
    ],

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ownerSchema.index({ phone: 1 });
ownerSchema.index({ email: 1 });
ownerSchema.index({ aadhaar: 1 });
ownerSchema.index({ pan: 1 });
ownerSchema.index({ isActive: 1 });

export const Owner = model<IOwner>("Owner", ownerSchema);
