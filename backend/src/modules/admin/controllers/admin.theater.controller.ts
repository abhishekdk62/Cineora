import { EmailService } from "../../../services/email.service";
import { TheaterRepository } from "../../theaters/repositories/theater.repository";
import { TheaterService } from "../../theaters/services/theater.service";
import { Request, Response, NextFunction } from "express";
const theaterRepo = new TheaterRepository();
const emailService=new EmailService()
const theaterservice = new TheaterService(theaterRepo,emailService);
export async function toggleTheaterStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Theater ID is required",
        success: false,
      });
    }
    const result = await theaterservice.toggleTheaterStatus(id);
    if (!result) {
      return res.status(404).json({
        message: "Theater not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Theater status toggled successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to toggle theater status",
      success: false,
    });
  }
}
export async function verifyTheater(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { theatreId } = req.params;
 
    let id=theatreId
    if (!id) {
      return res.status(400).json({
        message: "Theater ID is required",
        success: false,
      });
    }
    
    const result = await theaterservice.verifyTheater(id);
    if (!result) {
      return res.status(404).json({
        message: "Theater not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Theater verified successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    
    res.status(400).json({
      message: error.message || "Failed to verify theater",
      success: false,
    });
  }
}
export async function rejectTheater(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { theatreId } = req.params;
 
    let id=theatreId
    if (!id) {
      return res.status(400).json({
        message: "Theater ID is required",
        success: false,
      });
    }
    
    const result = await theaterservice.rejectTheater(id);
    if (!result) {
      return res.status(404).json({
        message: "Theater not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Theater rejected successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    
    res.status(400).json({
      message: error.message || "Failed to reject theater",
      success: false,
    });
  }
}
