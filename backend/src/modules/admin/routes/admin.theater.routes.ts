import express from "express";
import { TheaterController } from "../../theaters/controllers/theaters.controller";

export class AdminTheaterRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private theaterController:TheaterController
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get("/", (req, res) =>
      this.theaterController.getTheatersByOwnerId(req, res)
    );

    this.router.patch("/verify/:theatreId", (req, res) =>
      this.theaterController.verifyTheater(req, res)
    );

    this.router.patch("/reject/:theatreId", (req, res) =>
      this.theaterController.rejectTheater(req, res)
    );

    this.router.patch("/:id", (req, res) =>
      this.theaterController.toggleTheaterStatus(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
