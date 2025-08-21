import express, { Router } from "express";
import { ScreenController } from "../../screens/controllers/screens.controller";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";
import { MoviesController } from "../../movies/controllers/movies.controllers";
import { TheaterController } from "../../theaters/controllers/theaters.controller";
import { OwnerController } from "../controllers/owner.controller";


export class OwnerRoute {
  constructor(
    private router: express.Router = express.Router(),
    private screenController: ScreenController,
    private showtimeController: ShowtimeController,
    private movieController:MoviesController,
    private theaterController:TheaterController,
    private ownerController:OwnerController
  ) {
    this.setRoutes();
  }
  private setRoutes() {
    this.router.get("/screen/:screenId", (req, res) =>
      this.showtimeController.getShowtimesByScreen(req, res)
    );
    this.router.patch("/showtime/:id", (req, res) =>
      this.showtimeController.changeShowtimeStatus(req, res)
    );
    this.router.get("/showtime", (req, res) =>
      this.showtimeController.getShowTimes(req, res)
    );
    this.router.delete("/showtime/:showtimeId", (req, res) =>
      this.showtimeController.deleteShowtime(req, res)
    );
    this.router.put("/showtime/:showtimeId", (req, res) =>
      this.showtimeController.updateShowtime(req, res)
    );
    this.router.put("/showtime", (req, res) =>
      this.showtimeController.editShowtime(req, res)
    );
    this.router.post("/showtime", (req, res) =>
      this.showtimeController.createShowtime(req, res)
    );
    this.router.delete("/screens/:id", (req, res) =>
      this.screenController.deleteScreen(req, res)
    );
    this.router.patch("/screens/:id", (req, res) =>
      this.screenController.toggleScreenStatus(req, res)
    );
    this.router.put("/screens/:id", (req, res) =>
      this.screenController.updateScreen(req, res)
    );
    this.router.get("/screens/:id", (req, res) =>
      this.screenController.getScreenById(req, res)
    );
    this.router.get("/screens/theater/:theaterId/name/:name", (req, res) =>
      this.screenController.getScreenByTheaterAndName(req, res)
    );
    this.router.get("/screens/stats/:theaterId", (req, res) =>
      this.screenController.getScreenStats(req, res)
    );
    this.router.get("/screens/theater/:theaterId/count", (req, res) =>
      this.screenController.getScreenCountByTheaterId(req, res)
    );
    this.router.get("/screens/theater/:theaterId/active", (req, res) =>
      this.screenController.getActiveScreensByTheaterId(req, res)
    );
    this.router.get("/screens/theater/:theaterId", (req, res) =>
      this.screenController.getScreensByTheaterId(req, res)
    );
 
    this.router.post("/screens", (req, res) =>
      this.screenController.createScreen(req, res)
    );
    this.router.get("/movies/filter", (req, res) =>
      this.movieController.getMoviesWithFilters(req, res)
    );
    this.router.patch("/theaters/:theaterId", (req, res) =>
      this.theaterController.toggleTheaterStatus(req, res)
    );
    this.router.delete("/theaters/:theaterId", (req, res) =>
      this.theaterController.deleteTheater(req, res)
    );
    this.router.post("/theaters", (req, res) =>
      this.theaterController.createTheater(req, res)
    );
  
    this.router.put("/theaters/:theaterId", (req, res) =>
      this.theaterController.updateTheater(req, res)
    );
    this.router.get("/theaters", (req, res) =>
      this.theaterController.getTheatersByOwnerId(req, res)
    );
    this.router.patch("/reset-password", (req, res) =>
      this.ownerController.resetOwnerPassword(req, res)
    );
    this.router.post("/email/verify", (req, res) =>
      this.ownerController.verifyEmailChangeOtp(req, res)
    );
    this.router.post("/email/change", (req, res) =>
      this.ownerController.sendEmailChangeOtp(req, res)
    );
    this.router.get("/profile", (req, res) =>
      this.ownerController.getOwnerProfile(req, res)
    );
    this.router.put("/", (req, res) =>
      this.ownerController.updateOwner(req, res)
    );
    this.router.get("/screens/theater/:theaterId/filtered", (req, res) =>
      this.screenController.getScreensByTheaterIdWithFilters(req, res)
    );
    this.router.post("/screens/check-exists", (req, res) =>
  this.screenController.checkScreenExists(req, res)
);

  }
    public getRouter() {
    return this.router;
  }

}
