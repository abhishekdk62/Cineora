import express from "express";
import { TheaterController } from "../theaters/controllers/theaters.controller";
import { MoviesController } from "../movies/controllers/movies.controllers";
import { ShowtimeController } from "../showtimes/controllers/showtimes.controller";
import { TicketController } from "../tickets/controllers/ticket.controller";

export class CommonRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private moviesController: MoviesController,
    private theaterController: TheaterController,
    private showTimeController: ShowtimeController,
    private ticketController: TicketController
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get("/movies/filter", (req, res) =>
      this.moviesController.getMoviesWithFilters(req, res)
    );

    this.router.get("/movies/:movieId", (req, res) =>
      this.moviesController.getMovieById(req, res)
    );

    this.router.get("/theaters/filter", (req, res) =>
      this.theaterController.getTheatersWithFilters(req, res)
    );
    this.router.get("/theater/:theatreId", (req, res) =>
      this.theaterController.getTheaterById(req, res)
    );

    this.router.get("/theaters/from-movie/:movieId", (req, res) =>
      this.showTimeController.getTheatersByMovie(req, res)
    );
    this.router.get("/movies/from-theater/:theaterId", (req, res) =>
      this.showTimeController.getShowtimesByTheater(req, res)
    );
    this.router.get("/verify-ticket/:data", (req, res) =>
      this.ticketController.verifyTicketFromQrCode(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
