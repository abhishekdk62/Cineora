import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { createResponse } from "../../../utils/createResponse";

const authService = new AuthService();

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email and password are required",
        })
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Please enter a valid email address",
        })
      );
    }

    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(401).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    res.cookie("token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { token, ...restData } = result.data;

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
        data: restData,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function sendPasswordResetOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email is required",
        })
      );
    }

    const result = await authService.sendPasswordResetOTP(email)
    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
        data: result.data,
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function verifyPasswordResetOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email and otp required",
        })
      );
    }
    const result = await authService.verifyPasswordResetOtp(email,otp)
    
    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: "Otp verified successfully",
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordWithOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email,otp and newpassword required",
        })
      );
    }

    const result =await authService.resetPasswordWithOTP(email,otp,newPassword)
    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: "Password changed successfully",
      })
    );
  } catch (error) {
    next(error);
  }
}
