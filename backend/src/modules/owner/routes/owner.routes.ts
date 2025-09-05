import express, { Router } from "express";
import { ScreenController } from "../../screens/controllers/screens.controller";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";
import { MoviesController } from "../../movies/controllers/movies.controllers";
import { TheaterController } from "../../theaters/controllers/theaters.controller";
import { OwnerController } from "../controllers/owner.controller";
import { BookingController } from "../../bookings/controllers/bookings.controller";

export class OwnerRoute {
  constructor(
    private _router: express.Router = express.Router(),
    private _screenController: ScreenController,
    private _showtimeController: ShowtimeController,
    private _movieController: MoviesController,
    private _theaterController: TheaterController,
    private _ownerController: OwnerController,
    private _bookingsController: BookingController
  ) {
    this._setRoutes();
  }
  private _setRoutes() {
    this._router.get("/screen/:screenId", (req, res) =>
      this._showtimeController.getShowtimesByScreen(req, res)
    );
    this._router.patch("/showtime/:id", (req, res) =>
      this._showtimeController.changeShowtimeStatus(req, res)
    );
    this._router.get("/showtime", (req, res) =>
      this._showtimeController.getShowtimesByOwnerId(req, res)
    );
    this._router.delete("/showtime/:showtimeId", (req, res) =>
      this._showtimeController.deleteShowtime(req, res)
    );
    this._router.put("/showtime/:showtimeId", (req, res) =>
      this._showtimeController.updateShowtime(req, res)
    );
    this._router.put("/showtime", (req, res) =>
      this._showtimeController.editShowtime(req, res)
    );
    this._router.post("/showtime", (req, res) =>
      this._showtimeController.createShowtime(req, res)
    );
    this._router.delete("/screens/:id", (req, res) =>
      this._screenController.deleteScreen(req, res)
    );
    this._router.patch("/screens/:id", (req, res) =>
      this._screenController.toggleScreenStatus(req, res)
    );
    this._router.put("/screens/:id", (req, res) =>
      this._screenController.updateScreen(req, res)
    );
    this._router.get("/screens/:id", (req, res) =>
      this._screenController.getScreenById(req, res)
    );
    this._router.get("/screens/theater/:theaterId/name/:name", (req, res) =>
      this._screenController.getScreenByTheaterAndName(req, res)
    );
    this._router.get("/screens/stats/:theaterId", (req, res) =>
      this._screenController.getScreenStatisticsByTheaterId(req, res)
    );
    this._router.get("/screens/theater/:theaterId/count", (req, res) =>
      this._screenController.getScreenCountByTheaterId(req, res)
    );
    this._router.get("/screens/theater/:theaterId/active", (req, res) =>
      this._screenController.getActiveScreensByTheaterId(req, res)
    );
    this._router.get("/screens/theater/:theaterId", (req, res) =>
      this._screenController.getScreensByTheaterId(req, res)
    );

    this._router.post("/screens", (req, res) =>
      this._screenController.createScreen(req, res)
    );
    this._router.get("/movies/filter", (req, res) =>
      this._movieController.getMoviesWithFilters(req, res)
    );
    this._router.patch("/theaters/:theaterId", (req, res) =>
      this._theaterController.toggleTheaterStatus(req, res)
    );
    this._router.delete("/theaters/:theaterId", (req, res) =>
      this._theaterController.deleteTheater(req, res)
    );
    this._router.post("/theaters", (req, res) =>
      this._theaterController.createTheater(req, res)
    );

    this._router.put("/theaters/:theaterId", (req, res) =>
      this._theaterController.updateTheater(req, res)
    );
    this._router.get("/theaters", (req, res) =>
      this._theaterController.getTheatersByOwnerId(req, res)
    );
    this._router.patch("/reset-password", (req, res) =>
      this._ownerController.resetOwnerPassword(req, res)
    );
    this._router.post("/email/verify", (req, res) =>
      this._ownerController.verifyEmailChangeOtp(req, res)
    );
    this._router.post("/email/change", (req, res) =>
      this._ownerController.sendEmailChangeOtp(req, res)
    );
    this._router.get("/profile", (req, res) =>
      this._ownerController.getOwnerProfile(req, res)
    );
    this._router.put("/", (req, res) =>
      this._ownerController.updateOwner(req, res)
    );
    this._router.get("/screens/theater/:theaterId/filtered", (req, res) =>
      this._screenController.getScreensByTheaterIdWithAdvancedFilters(req, res)
    );
    this._router.post("/screens/check-exists", (req, res) =>
      this._screenController.checkScreenExists(req, res)
    );
    this._router.get("/bookings/:showtimeId", (req, res) =>
      this._bookingsController.getBookingsByShowtimeId(req, res)
    );
    this._router.get("/showtimes/:theaterId/:screenId", (req, res) =>
      this._showtimeController.getShowtimesByFilters(req, res)
    );
  }
  public getRouter() {
    return this._router;
  }
}
