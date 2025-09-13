import express from "express";
import { MoviesController } from "../../movies/controllers/movies.controllers";
import { OwnerController } from "../../owner/controllers/owner.controller";
import { OwnerRequestController } from "../../owner/controllers/ownerRequest.controller";
import { ScreenController } from "../../screens/controllers/screens.controller";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";
import { TheaterController } from "../../theaters/controllers/theaters.controller";
import { UserController } from "../../user/controllers/user.controller";
import { WalletController } from "../../wallet/controllers/wallet.controller";
import { WalletTransactionController } from "../../walletTransaction/controllers/walletTransaction.controller";


export class AdminRoutes {
  constructor(
    private _router: express.Router = express.Router(),
    private _moviesController: MoviesController,
    private _ownerController: OwnerController,
    private _userController: UserController,
    private _ownerRequestController: OwnerRequestController,
    private _screenController: ScreenController,
    private _controller: ShowtimeController,
    private _theaterController: TheaterController,
    private _walletController: WalletController,
    private _walletTransactionController: WalletTransactionController,
  ) {
    this._setRoutes();
  }
  private _setRoutes() {

    this._router.get("/wallet", (req, res) =>
      this._walletController.getWalletBalance(req, res)
    );
    this._router.get("/transaction", (req, res) =>
      this._walletTransactionController.getUserWalletTransactions(req, res)
    );

    this._router.get("/users", (req, res) =>
      this._userController.getUsers(req, res)
    );

    this._router.get("/users/counts", (req, res) =>
      this._userController.getUserCounts(req, res)
    );

    this._router.patch("/users/:id/toggle-status", (req, res) =>
      this._userController.toggleUserStatus(req, res)
    );

    this._router.get("/users/:id", (req, res) =>
      this._userController.getUserDetails(req, res)
    );
    this._router.get("/theaters", (req, res) =>
      this._theaterController.getTheatersByOwnerId(req, res)
    );

    this._router.patch("/theaters/verify/:theatreId", (req, res) =>
      this._theaterController.verifyTheater(req, res)
    );

    this._router.patch("/theaters/reject/:theatreId", (req, res) =>
      this._theaterController.rejectTheater(req, res)
    );

    this._router.patch("/theaters/:id", (req, res) =>
      this._theaterController.toggleTheaterStatus(req, res)
    );
    this._router.get("/showtimes/:screenId", (req, res) =>
      this._controller.getShowtimesByScreenAdmin(req, res)
    );

    this._router.patch("/showtimes/:showtimeId", (req, res) =>
      this._controller.changeShowtimeStatus(req, res)
    );

    this._router.delete("/showtimes/:showtimeId", (req, res) =>
      this._controller.deleteShowtime(req, res)
    );
    this._router.get("/screens/", (req, res) =>
      this._screenController.getAllScreensPaginated(req, res)
    );

    this._router.get("/screens/theater/:theaterId", (req, res) =>
      this._screenController.getScreensByTheaterId(req, res)
    );
    this._router.get("/screens/:id", (req, res) =>
      this._screenController.getScreenById(req, res)
    );

    this._router.get("/screens/theater/:theaterId/filtered", (req, res) =>
      this._screenController.getScreensByTheaterIdWithAdvancedFilters(req, res)
    );

    this._router.get("/screens/theater/:theaterId/active", (req, res) =>
      this._screenController.getActiveScreensByTheaterId(req, res)
    );

    this._router.get("/screens/theater/:theaterId/count", (req, res) =>
      this._screenController.getScreenCountByTheaterId(req, res)
    );

    this._router.get("/screens/theater/:theaterId/name/:name", (req, res) =>
      this._screenController.getScreenByTheaterAndName(req, res)
    );

    this._router.patch("/screens/:id", (req, res) =>
      this._screenController.toggleScreenStatus(req, res)
    );

    this._router.delete("/screens/:id", (req, res) =>
      this._screenController.deleteScreen(req, res)
    );
    this._router.post("/movies", (req, res) =>
      this._moviesController.addMovie(req, res)
    );

    this._router.get("/movies", (req, res) =>
      this._moviesController.getMovies(req, res)
    );

    this._router.get("/movies/filter", (req, res) =>
      this._moviesController.getMoviesWithFilters(req, res)
    );

    this._router.get("/movies/:movieId", (req, res) =>
      this._moviesController.getMovieById(req, res)
    );

    this._router.patch("/movies/:movieId/toggle-status", (req, res) =>
      this._moviesController.toggleMovieStatus(req, res)
    );

    this._router.put("/movies/:movieId", (req, res) =>
      this._moviesController.updateMovie(req, res)
    );

    this._router.delete("/movies/:movieId", (req, res) =>
      this._moviesController.deleteMovie(req, res)
    );
    this._router.get("/owners/counts", (req, res) =>
      this._ownerController.getOwnerCounts(req, res)
    );

    this._router.get("/owners", (req, res) =>
      this._ownerController.getOwners(req, res)
    );

    this._router.get("/owners/requests", (req, res) =>
      this._ownerRequestController.getOwnerRequests(req, res)
    );

    this._router.patch("/owners/:ownerId/toggle-status", (req, res) =>
      this._ownerController.toggleOwnerStatus(req, res)
    );

    this._router.patch("/owners/requests/:requestId/accept", (req, res) =>
      this._ownerRequestController.acceptOwnerRequest(req, res)
    );

    this._router.patch("/owners/requests/:requestId/reject", (req, res) =>
      this._ownerRequestController.rejectOwnerRequest(req, res)
    );
  }

  public getRouter() {
    return this._router;
  }
}
