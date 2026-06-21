import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireOwner,
  requireStaff,
} from "./modules/auth/middleware/auth.middleware";
import { getSignedUrl } from "./utils/signCloudinaryUpload";
import { errorLogger, requestLogger } from "./utils/logger";
import { SocketService } from "./services/socket.service";
import { buildApplicationRouteRegistry } from "./container/dependencyContainer";

export class App {
  private readonly _app: Application;
  private readonly _server: HttpServer;
  private readonly _io: SocketIOServer;
  private readonly _socketService: SocketService;

  constructor() {
    this._app = express();
    this._server = createServer(this._app);
    this._io = new SocketIOServer(this._server, {
      cors: {
        origin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this._socketService = new SocketService(this._io);

    this._setMiddlewares();
    this._setUtilityRoutes();
    this._setModuleRoutes();
    this._setErrorHandling();
  }

  private _setMiddlewares(): void {
    this._app.use(helmet());
    this._app.use(cookieParser());
    this._app.use(express.json({ limit: "10mb" }));
    this._app.use(express.urlencoded({ limit: "10mb", extended: true }));
    this._app.use(morgan("dev"));
    this._app.use(requestLogger);
    this._app.use(
      cors({
        origin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );
  }

  private _setUtilityRoutes(): void {
    this._app.use("/api/sign-cloudinary", getSignedUrl);
  }

  private _setModuleRoutes(): void {
    const routes = buildApplicationRouteRegistry(this._socketService);

    this._app.use("/api/health", (_req, res) => {
      res.status(200).json({ message: "done", time: new Date() });
    });

    this._app.use("/api/auth", routes.authRoutes.getRouter());
    this._app.use(
      "/api/staff",
      authenticateToken,
      requireStaff,
      routes.staffRoutes.getRouter()
    );
    this._app.use(
      "/api/users",
      authenticateToken,
      requireUser,
      routes.userRoutes.getRouter()
    );
    this._app.use("/api/owners", routes.ownerReqRoutes.getRouter());
    this._app.use(
      "/api/owner",
      authenticateToken,
      requireOwner,
      routes.ownerRoutes.getRouter()
    );
    this._app.use(
      "/api/analytics",
      authenticateToken,
      routes.analyticsRoutes.getRouter()
    );
    this._app.use(
      "/api/admin/analytics",
      authenticateToken,
      requireAdmin,
      routes.adminAnalyticsRoutes.getRouter()
    );
    this._app.use(
      "/api/admin",
      authenticateToken,
      requireAdmin,
      routes.adminRoutes.getRouter()
    );
    this._app.use("/api/common", routes.commonRoutes.getRouter());

    this._app.use((_req, res) =>
      res.status(404).json({ success: false, message: "Route not found" })
    );
  }

  private _setErrorHandling(): void {
    this._app.use(errorLogger);
  }

  public getApp(): HttpServer {
    return this._server;
  }
}
