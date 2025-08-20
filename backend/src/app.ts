import { Request, Response } from "express";
const express = require("express");
import * as cookieParser from "cookie-parser";

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/user/routes/user.routes";
import ownerReqRoutes from "./modules/owner/routes/ownerRequest.routes";
import ownerRoutes from "./modules/owner/routes/owner.routes";
import commonRoutes from "./modules/common/routes";
import adminRoutes from "./modules/admin/routes/index.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireOwner,
} from "./modules/auth/middleware/auth.middleware";
import { signCloudinaryUpload } from "./utils/signCloudinaryUpload";

export const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use((req: Request, res: Response, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/sign-cloudinary',signCloudinaryUpload)
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateToken, requireUser, userRoutes);
app.use("/api/owners", ownerReqRoutes);
app.use("/api/owner", authenticateToken, requireOwner, ownerRoutes);
app.use("/api/admin", authenticateToken, requireAdmin, adminRoutes);
app.use("/api/common", commonRoutes);

app.use((req: Request, res: Response) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

app.use(errorMiddleware);
