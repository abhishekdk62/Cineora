import express from "express";
import { MoviesController } from "../../movies/controllers/movies.controllers";

export class AdminMovieRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private moviesController: MoviesController
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    // POST /
    this.router.post("/", (req, res) =>
      this.moviesController.addMovie(req, res)
    );

    // GET /
    this.router.get("/", (req, res) =>
      this.moviesController.getMovies(req, res)
    );

    // GET /filter  <- keep before /:movieId so "filter" doesn't match as an id
    this.router.get("/filter", (req, res) =>
      this.moviesController.getMoviesWithFilters(req, res)
    );

    // GET /:movieId
    this.router.get("/:movieId", (req, res) =>
      this.moviesController.getMovieById(req, res)
    );

    // PATCH /:movieId/toggle-status
    this.router.patch("/:movieId/toggle-status", (req, res) =>
      this.moviesController.toggleMovieStatus(req, res)
    );

    // PUT /:movieId
    this.router.put("/:movieId", (req, res) =>
      this.moviesController.updateMovie(req, res)
    );

    // DELETE /:movieId
    this.router.delete("/:movieId", (req, res) =>
      this.moviesController.deleteMovie(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
