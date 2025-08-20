import express from "express";
import { UserController } from "../../user/controllers/user.controller";

export class AdminUserRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private userController: UserController
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get("/", (req, res) =>
      this.userController.getUsers(req, res)
    );

    this.router.get("/counts", (req, res) =>
      this.userController.getUserCounts(req, res)
    );

    this.router.patch("/:id/toggle-status", (req, res) =>
      this.userController.toggleUserStatus(req, res)
    );

    this.router.get("/:id", (req, res) =>
      this.userController.getUserDetails(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
