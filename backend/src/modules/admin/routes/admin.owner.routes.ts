import express from "express";
import { OwnerController } from "../../owner/controllers/owner.controller";
import { OwnerRequestController } from "../../owner/controllers/ownerRequest.controller";

export class AdminOwnerRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private ownerController: OwnerController,
    private ownerRequestController:OwnerRequestController
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get("/counts", (req, res) =>
      this.ownerController.getOwnerCounts(req, res)
    );

    this.router.get("/", (req, res) =>
      this.ownerController.getOwners(req, res)
    );

    this.router.get("/requests", (req, res) =>
      this.ownerRequestController.getOwnerRequests(req, res)
    );

    this.router.patch("/:ownerId/toggle-status", (req, res) =>
      this.ownerController.toggleOwnerStatus(req, res)
    );

    this.router.patch("/requests/:requestId/accept", (req, res) =>
      this.ownerRequestController.acceptOwnerRequest(req, res)
    );

    this.router.patch("/requests/:requestId/reject", (req, res) =>
      this.ownerRequestController.rejectOwnerRequest(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
