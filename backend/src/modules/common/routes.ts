import express from "express";
import { TheaterController } from "../theaters/controllers/theaters.controller";
import { MoviesController } from "../movies/controllers/movies.controllers";
import { ShowtimeController } from "../showtimes/controllers/showtimes.controller";
import { TicketController } from "../tickets/controllers/ticket.controller";
import { ReviewController } from "../reviews/controllers/review.controller";

export class CommonRoutes {
  constructor(
    private _router: express.Router = express.Router(),
    private _moviesController: MoviesController,
    private _theaterController: TheaterController,
    private _showTimeController: ShowtimeController,
    private _ticketController: TicketController,
    private reviewsController: ReviewController
  ) {
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get("/movies/filter", (req, res) =>
      this._moviesController.getMoviesWithFilters(req, res)
    );

    this._router.get("/movies/:movieId", (req, res) =>
      this._moviesController.getMovieById(req, res)
    );

    this._router.get("/theaters/filter", (req, res) =>
      this._theaterController.getTheatersWithFilters(req, res)
    );
    this._router.get("/theater/:theatreId", (req, res) =>
      this._theaterController.getTheaterById(req, res)
    );

    this._router.get("/theaters/from-movie/:movieId", (req, res) =>
      this._showTimeController.getTheatersByMovie(req, res)
    );
    this._router.get("/movies/from-theater/:theaterId", (req, res) =>
      this._showTimeController.getShowtimesByTheater(req, res)
    );
    this._router.get("/verify-ticket/:data", (req, res) =>
      this._ticketController.verifyTicketFromQrCode(req, res)
    );
    this._router.get("/reviews/movies/:movieId", (req, res) =>
      this.reviewsController.getMovieReviews(req, res)
    );
    this._router.get("/reviews/theater/:theaterId", (req, res) =>
      this.reviewsController.getTheaterReviews(req, res)
    );
    this._router.get("/reviews/stats/movies/:movieId", (req, res) =>
      this.reviewsController.getMovieRatingStats(req, res)
    );
    this._router.get("/reviews/stats/theaters/:theaterId", (req, res) =>
      this.reviewsController.getTheaterRatingStats(req, res)
    );
  }

  public getRouter() {
    return this._router;
  }
}
