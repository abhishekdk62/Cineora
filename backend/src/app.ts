import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { MoviesController } from "./modules/movies/controllers/movies.controllers";
import { OwnerController } from "./modules/owner/controllers/owner.controller";
import { OwnerRequestController } from "./modules/owner/controllers/ownerRequest.controller";
import { ScreenController } from "./modules/screens/controllers/screens.controller";
import { ShowtimeController } from "./modules/showtimes/controllers/showtimes.controller";
import { TheaterController } from "./modules/theaters/controllers/theaters.controller";
import { UserController } from "./modules/user/controllers/user.controller";
import { AuthController } from "./modules/auth/controllers/auth.controller";
import { UserRoutes } from "./modules/user/routes/user.routes";
import { OwnerRoute as OwnerMainRoute } from "./modules/owner/routes/owner.routes";
import { OwnerRoute as OwnerRequestRoute } from "./modules/owner/routes/ownerRequest.routes";
import { CommonRoutes } from "./modules/common/routes";
import { AuthRoute } from "./modules/auth/routes/auth.routes";

import { UserService } from "./modules/user/services/user.service";
import { TheaterService } from "./modules/theaters/services/theater.service";
import { MovieService } from "./modules/movies/services/movies.service";
import { OwnerService } from "./modules/owner/services/owner.service";
import { OwnerRequestService } from "./modules/owner/services/ownerRequest.service";
import { OTPService } from "./modules/otp/services/otp.service";
import { AuthService } from "./modules/auth/services/auth.service";

import { UserRepository } from "./modules/user/repositories/user.repository";
import { TheaterRepository } from "./modules/theaters/repositories/theater.repository";
import { MovieRepository } from "./modules/movies/repositories/movie.repository";
import { OwnerRepository } from "./modules/owner/repositories/owner.repository";
import { OwnerRequestRepository } from "./modules/owner/repositories/ownerRequest.repository";
import { OTPRepository } from "./modules/otp/repositories/otp.repository";
import { AdminRepository } from "./modules/admin/repositories/admin.repository";

import { EmailService } from "./services/email.service";
import {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireOwner,
} from "./modules/auth/middleware/auth.middleware";
import { getSignedUrl } from "./utils/signCloudinaryUpload";
import { AdminRoutes } from "./modules/admin/routes/admin.routes";
import { ShowtimeRepository } from "./modules/showtimes/repositories/showtimes.repository";
import { ScreenRepository } from "./modules/screens/repositories/screens.repositories";
import { ScreenService } from "./modules/screens/services/screens.service";
import { ShowtimeService } from "./modules/showtimes/services/showtimes.service";

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setUtilityRoutes();
    this.setModuleRoutes();
  }
  private setMiddlewares() {
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ limit: "10mb", extended: true }));
    this.app.use(
      cors({
        origin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );
    this.app.use(morgan("dev"));
  }

  private setUtilityRoutes() {
    this.app.use("/api/sign-cloudinary", getSignedUrl);
  }

  private setModuleRoutes() {
    const emailService = new EmailService();

    const userRepo = new UserRepository();
    const ownerRepo = new OwnerRepository();
    const ownerRequestRepo = new OwnerRequestRepository();
    const otpRepo = new OTPRepository();
    const adminRepo = new AdminRepository();
    const theaterRepo = new TheaterRepository();
    const screenRepo = new ScreenRepository();
    const showtimeRepo = new ShowtimeRepository();
    const movieRepo = new MovieRepository();

    const userService = new UserService(
      userRepo,
      ownerRepo,
      ownerRequestRepo,
      otpRepo,
      emailService
    );
    const ownerService = new OwnerService(
      emailService,
      ownerRepo,
      ownerRequestRepo,
      otpRepo,
      userRepo
    );
    const ownerRequestService = new OwnerRequestService(
      ownerRequestRepo,
      ownerRepo,
      otpRepo,
      userRepo,
      emailService
    );
    const otpService = new OTPService(otpRepo);
    const theaterService = new TheaterService(theaterRepo, emailService);
    const screenService = new ScreenService(screenRepo, theaterRepo);
    const showtimeService = new ShowtimeService(showtimeRepo);
    const movieService = new MovieService(movieRepo);
    const authService = new AuthService(
      userRepo,
      adminRepo,
      ownerRepo,
      otpRepo,
      emailService,
      ownerRequestRepo
    );

    const userController = new UserController(
      userService,
      authService,
      movieService
    );
    const ownerController = new OwnerController(ownerService);
    const ownerRequestController = new OwnerRequestController(
      ownerRequestService
    );
    const screenController = new ScreenController(screenService);
    const showtimeController = new ShowtimeController(showtimeService);
    const theaterController = new TheaterController(
      theaterService,
      screenService
    );
    const moviesController = new MoviesController(movieService);
    const authController = new AuthController(authService);

    const adminRoutes = new AdminRoutes(
      express.Router(),
      moviesController,
      ownerController,
      userController,
      ownerRequestController,
      screenController,
      showtimeController,
      theaterController
    );

    const userRoutes = new UserRoutes(
      express.Router(),
      userController,
      theaterController,
      showtimeController
    );

    const ownerRoutes = new OwnerMainRoute(
      express.Router(),
      screenController,
      showtimeController,
      moviesController,
      theaterController,
      ownerController
    );

    const ownerReqRoutes = new OwnerRequestRoute(
      express.Router(),
      ownerRequestController
    );

    const commonRoutes = new CommonRoutes(
      express.Router(),
      moviesController,
      theaterController,
      showtimeController
    );

    const authRoutes = new AuthRoute(
      express.Router(),
      authController,
      userController
    );

    this.app.use("/api/auth", authRoutes.getRouter());
    this.app.use(
      "/api/users",
      authenticateToken,
      requireUser,
      userRoutes.getRouter()
    );
    this.app.use("/api/owners", ownerReqRoutes.getRouter());
    this.app.use(
      "/api/owner",
      authenticateToken,
      requireOwner,
      ownerRoutes.getRouter()
    );
    this.app.use(
      "/api/admin",
      authenticateToken,
      requireAdmin,
      adminRoutes.getRouter()
    );
    this.app.use("/api/common", commonRoutes.getRouter());

    this.app.use((req, res) =>
      res.status(404).json({ success: false, message: "Route not found" })
    );
  }

  public getApp() {
    return this.app;
  }
}
