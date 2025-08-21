import express from "express";
import { MoviesController } from "../../movies/controllers/movies.controllers";
import { OwnerController } from "../../owner/controllers/owner.controller";
import { OwnerRequestController } from "../../owner/controllers/ownerRequest.controller";
import { ScreenController } from "../../screens/controllers/screens.controller";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";
import { TheaterController } from "../../theaters/controllers/theaters.controller";
import { UserController } from "../../user/controllers/user.controller";

export class AdminRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private moviesController: MoviesController,
    private ownerController: OwnerController,
    private userController: UserController,
    private ownerRequestController: OwnerRequestController,
    private screenController: ScreenController,
    private controller: ShowtimeController,
    private theaterController: TheaterController
  ) {
    this.setRoutes();
  }
  private setRoutes() {
    this.router.get("/users", (req, res) => this.userController.getUsers(req, res));

    this.router.get("/users/counts", (req, res) =>
      this.userController.getUserCounts(req, res)
    );

    this.router.patch("/users/:id/toggle-status", (req, res) =>
      this.userController.toggleUserStatus(req, res)
    );

    this.router.get("/users/:id", (req, res) =>
      this.userController.getUserDetails(req, res)
    );
    this.router.get("/theaters", (req, res) =>
      this.theaterController.getTheatersByOwnerId(req, res)
    );

    this.router.patch("/theaters/verify/:theatreId", (req, res) =>
      this.theaterController.verifyTheater(req, res)
    );

    this.router.patch("/theaters/reject/:theatreId", (req, res) =>
      this.theaterController.rejectTheater(req, res)
    );

    this.router.patch("/theaters/:id", (req, res) =>
      this.theaterController.toggleTheaterStatus(req, res)
    );
    this.router.get("/showtimes/:screenId", (req, res) =>
      this.controller.getShowtimesByScreenAdmin(req, res)
    );

    // this.router.get("/:showtimeId", (req, res) =>
    //   this.controller.getShowtime(req, res)
    // );

    this.router.patch("/showtimes/:showtimeId", (req, res) =>
      this.controller.changeShowtimeStatus(req, res)
    );

    this.router.delete("/showtimes/:showtimeId", (req, res) =>
      this.controller.deleteShowtime(req, res)
    );
    this.router.get("/screens/", (req, res) =>
      this.screenController.getAllScreens(req, res)
    );

    
    this.router.get("/screens/theater/:theaterId", (req, res) =>
      this.screenController.getScreensByTheaterId(req, res)
    );
this.router.get("/screens/:id", (req, res) =>
      this.screenController.getScreenById(req, res)
    );

    this.router.get("/screens/theater/:theaterId/filtered", (req, res) =>
      this.screenController.getScreensByTheaterIdWithFilters(req, res)
    );

    this.router.get("/screens/theater/:theaterId/active", (req, res) =>
      this.screenController.getActiveScreensByTheaterId(req, res)
    );

    this.router.get("/screens/theater/:theaterId/count", (req, res) =>
      this.screenController.getScreenCountByTheaterId(req, res)
    );

    this.router.get("/screens/theater/:theaterId/name/:name", (req, res) =>
      this.screenController.getScreenByTheaterAndName(req, res)
    );

    this.router.patch("/screens/:id", (req, res) =>
      this.screenController.toggleScreenStatus(req, res)
    );

    this.router.delete("/screens/:id", (req, res) =>
      this.screenController.deleteScreen(req, res)
    );
    // POST /
    this.router.post("/movies", (req, res) =>
      this.moviesController.addMovie(req, res)
    );

    // GET /
    this.router.get("/movies", (req, res) =>
      this.moviesController.getMovies(req, res)
    );

    // GET /filter  <- keep before /:movieId so "filter" doesn't match as an id
    this.router.get("/movies/filter", (req, res) =>
      this.moviesController.getMoviesWithFilters(req, res)
    );

    // GET /:movieId
    this.router.get("/movies/:movieId", (req, res) =>
      this.moviesController.getMovieById(req, res)
    );

    // PATCH /:movieId/toggle-status
    this.router.patch("/movies/:movieId/toggle-status", (req, res) =>
      this.moviesController.toggleMovieStatus(req, res)
    );

    // PUT /:movieId
    this.router.put("/movies/:movieId", (req, res) =>
      this.moviesController.updateMovie(req, res)
    );

    // DELETE /:movieId
    this.router.delete("/movies/:movieId", (req, res) =>
      this.moviesController.deleteMovie(req, res)
    );
    this.router.get("/owners/counts", (req, res) =>
      this.ownerController.getOwnerCounts(req, res)
    );

    this.router.get("/owners", (req, res) =>
      this.ownerController.getOwners(req, res)
    );

    this.router.get("/owners/requests", (req, res) =>
      this.ownerRequestController.getOwnerRequests(req, res)
    );

    this.router.patch("/owners/:ownerId/toggle-status", (req, res) =>
      this.ownerController.toggleOwnerStatus(req, res)
    );

    this.router.patch("/owners/requests/:requestId/accept", (req, res) =>
      this.ownerRequestController.acceptOwnerRequest(req, res)
    );

    this.router.patch("/owners/requests/:requestId/reject", (req, res) =>
      this.ownerRequestController.rejectOwnerRequest(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
