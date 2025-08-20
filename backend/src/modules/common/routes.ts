import express from "express";
import { TheaterController } from "../theaters/controllers/theaters.controller";
import { MoviesController } from "../movies/controllers/movies.controllers";

export class CommonRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private moviesController:MoviesController,
    private theaterController: TheaterController
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
  }

  public getRouter() {
    return this.router;
  }
}
