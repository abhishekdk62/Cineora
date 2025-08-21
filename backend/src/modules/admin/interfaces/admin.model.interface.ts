import { Document, Types } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  refreshToken: string;
}
