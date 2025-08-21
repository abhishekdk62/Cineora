import mongoose, { Schema, Document } from "mongoose";
import { IAdmin } from "../interfaces/admin.model.interface";


const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
});

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
