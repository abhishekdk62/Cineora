import express from "express";
import { TicketController } from "../../tickets/controllers/ticket.controller";
import { StaffController } from "../controller/staff.controller";

export class StaffRoutes {
  constructor(
    private _router: express.Router = express.Router(),
    private _ticketController: TicketController,
    private _staffController: StaffController,

  ) {
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post("/verify-ticket", (req, res) =>
      this._ticketController.verifyTicketFromQrCode(req, res)
    );
    this._router.get("/details", (req, res) =>
      this._staffController.getStaffDetails(req, res)
    );
  }
    public getRouter() {
    return this._router;
  }
}
