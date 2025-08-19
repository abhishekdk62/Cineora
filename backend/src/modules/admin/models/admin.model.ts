import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  refreshToken: string;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
});

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
