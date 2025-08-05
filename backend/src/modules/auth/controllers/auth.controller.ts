import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.services';
import { createResponse } from '../../../utils/createResponse';
import { config } from '../../../config';

const authService = new AuthService();

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'Email and password are required' 
      }));
    }

    // 2️⃣ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Please enter a valid email address'
      }));
    }

    const result = await authService.login(email, password);
    
    if (!result.success) {
      return res.status(401).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    res.cookie("token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    const { token, ...restData } = result.data;

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: restData
    }));

  } catch (err) {
    next(err);
  }
}
