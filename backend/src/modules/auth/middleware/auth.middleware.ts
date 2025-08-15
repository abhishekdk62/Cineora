import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { createResponse } from '../../../utils/createResponse';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../../user/repositories/user.repository';
import { AdminRepository } from '../../admin/repositories/admin.repository';
import { OwnerRepository } from '../../owner/repositories/owner.repository';
import { OTPRepository } from '../../otp/repositories/otp.repository';
import { EmailService } from '../../../services/email.service';
import { OwnerRequestRepository } from '../../owner/repositories/ownerRequest.repository';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      admin?: any;
      owner?: any;
      userRole?: 'user' | 'admin' | 'owner';
    }
  }
}
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!accessToken) {
      if (refreshToken) {
        try {
           const userRepo = new UserRepository();
          const adminRepo = new AdminRepository();
          const ownerRepo = new OwnerRepository();
          const otpRepo = new OTPRepository();
          const emailService = new EmailService();
          const ownerRequestRepo = new OwnerRequestRepository();
          const authService = new AuthService(
            userRepo,
            adminRepo,
            ownerRepo,
            otpRepo,
            emailService,
            ownerRequestRepo
          );
          const refreshResult = await authService.refreshAccessToken(refreshToken);
          if (refreshResult.success) {
            res.cookie("accessToken", refreshResult.data.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshResult.data.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const newDecoded: any = jwt.verify(
              refreshResult.data.accessToken,
              config.jwtAccessSecret
            );
            setUserFromDecoded(req, newDecoded);
            return next();
          }
        } catch (err) {
          return res.status(401).json(createResponse({
            success: false,
            message: "Token refresh failed. Please login again."
          }));
        }
      }
      return res.status(401).json(createResponse({
        success: false,
        message: "Access denied. No token provided."
      }));
    }
    try {
      const decoded: any = jwt.verify(accessToken, config.jwtAccessSecret);
      setUserFromDecoded(req, decoded);
      return next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError" && refreshToken) {
        try {
          const userRepo = new UserRepository();
          const adminRepo = new AdminRepository();
          const ownerRepo = new OwnerRepository();
          const otpRepo = new OTPRepository();
          const emailService = new EmailService();
          const ownerRequestRepo = new OwnerRequestRepository();
          const authService = new AuthService(
            userRepo,
            adminRepo,
            ownerRepo,
            otpRepo,
            emailService,
            ownerRequestRepo
          );
          const refreshResult = await authService.refreshAccessToken(refreshToken);

          if (refreshResult.success) {
            res.cookie("accessToken", refreshResult.data.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshResult.data.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const newDecoded: any = jwt.verify(
              refreshResult.data.accessToken,
              config.jwtAccessSecret
            );
            setUserFromDecoded(req, newDecoded);
            return next();
          }
        } catch (err) {
          return res.status(401).json(createResponse({
            success: false,
            message: "Token refresh failed. Please login again."
          }));
        }
      }

      return res.status(401).json(createResponse({
        success: false,
        message: refreshToken
          ? "Token refresh failed. Please login again."
          : "Invalid token."
      }));
    }
  } catch (error) {
    return res.status(401).json(createResponse({
      success: false,
      message: "Authentication failed."
    }));
  }
};


function setUserFromDecoded(req: Request, decoded: any) {
  switch (decoded.role) {
    case "admin":
      req.admin = {
        adminId: decoded.adminId,
        email: decoded.email,
        role: "admin"
      };
      break;
    case "owner":
      req.owner = {
        ownerId: decoded.ownerId,
        email: decoded.email,
        role: "owner"
      };
      break;
    case "user":
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: "user"
      };
      break;
    default:
      throw new Error("Invalid token role");
  }
}
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  
  if (req.admin.role !== 'admin') {
    return res.status(403).json(createResponse({
      success: false,
      message: 'Admin access required.'
    }));
  }
  next();
};
export const requireOwner = (req: Request, res: Response, next: NextFunction) => {
  
  if (req.owner.role !== 'owner') {
    return res.status(403).json(createResponse({
      success: false,
      message: 'Owner access required.'
    }));
  }
  next();
};
export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'user') {
    return res.status(403).json(createResponse({
      success: false,
      message: 'User access required.'
    }));
  }
  next();
};
export const requireAnyRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json(createResponse({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      }));
    }
    next();
  };
};
