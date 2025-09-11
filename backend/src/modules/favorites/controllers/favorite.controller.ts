import { Request, Response } from "express";

import { IFavoriteService } from "../interfaces/favorite.service.interface";
export class MovieFavoriteController {
  constructor(private readonly _favoriteService: IFavoriteService) {}

  async addToFavorites(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.body as { movieId: string };
      const userId = req.user?.id; 

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      if (!movieId) {
        res.status(400).json({ success: false, message: "Movie ID is required" });
        return;
      }

      const result = await this._favoriteService.addToFavorites(userId, movieId);
      
      const statusCode = result.success ? 201 : 400;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async removeFromFavorites(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const result = await this._favoriteService.removeFromFavorites(userId, movieId);
      
      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUserFavorites(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const result = await this._favoriteService.getUserFavorites(userId, page, limit);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.body as { movieId: string };
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      if (!movieId) {
        res.status(400).json({ success: false, message: "Movie ID is required" });
        return;
      }

      const result = await this._favoriteService.toggleFavorite(userId, movieId);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async isFavorite(req: Request, res: Response): Promise<void> {
    try {
      
      const { movieId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const isFavorite = await this._favoriteService.isFavorite(userId, movieId);
      
      res.status(200).json({
        success: true,
        isFavorite,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getFavoriteCount(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;

      const count = await this._favoriteService.getFavoriteCount(movieId);
      
      res.status(200).json({
        success: true,
        data: { favoriteCount: count },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

 
}
