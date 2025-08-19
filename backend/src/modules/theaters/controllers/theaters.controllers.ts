import { Request, Response, NextFunction } from "express";
import { TheaterService } from "../services/theater.service";
import { TheaterRepository } from "../repositories/theater.repository";
import { EmailService } from "../../../services/email.service";
const theaterRepo = new TheaterRepository();
const emailService = new EmailService();
const theaterService = new TheaterService(theaterRepo, emailService);

export async function getTheatersWithFilters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = {
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 6,
      latitude: req.query.latitude
        ? parseFloat(req.query.latitude as string)
        : undefined,
      longitude: req.query.longitude
        ? parseFloat(req.query.longitude as string)
        : undefined,
    };

    const result = await theaterService.getTheatersWithFilters(filters);

    return res.status(200).json({
      theaters: result.theaters,
      totalCount: result.total,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    });
  } catch (err) {
    next(err);
  }
}
