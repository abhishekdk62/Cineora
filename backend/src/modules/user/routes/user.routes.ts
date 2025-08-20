import express from "express";
import { UserController } from "../controllers/user.controller";

export class UserRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private userController: UserController
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get("/profile", (req, res) =>
      this.userController.getUserProfile(req, res)
    );

    this.router.patch("/reset-password", (req, res) =>
      this.userController.resetPassword(req, res)
    );

    this.router.put("/profile", (req, res) =>
      this.userController.updateProfile(req, res)
    );

    this.router.post("/email/change", (req, res) =>
      this.userController.changeEmail(req, res)
    );

    this.router.post("/email/verify", (req, res) =>
      this.userController.verifyChangeEmailOtp(req, res)
    );

    this.router.get("/nearby/:id", (req, res) =>
      this.userController.getNearbyUsers(req, res)
    );

    this.router.post("/xp/:id", (req, res) =>
      this.userController.addXpPoints(req, res)
    );

    this.router.patch("/location", (req, res) =>
      this.userController.updateUserLocation(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
