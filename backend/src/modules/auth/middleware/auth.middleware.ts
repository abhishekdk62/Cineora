import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { createResponse } from '../../../utils/createResponse';

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

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json(
        createResponse({
          success: false,
          message: "Access denied. No token provided."
        })
      );
    }

    const decoded: any = jwt.verify(token, config.jwtSecret);

    switch (decoded.role) {
      case "admin":
        req.admin = decoded;
        req.userRole = "admin";
        break;
      case "owner":
        req.owner = decoded;
        req.userRole = "owner";
        break;
      case "user":
        req.user = decoded;
        req.userRole = "user";
        break;
      default:
        return res.status(401).json(
          createResponse({
            success: false,
            message: "Invalid token role."
          })
        );
    }
    next();
  } catch (error) {
    return res.status(401).json(
      createResponse({
        success: false,
        message: "Invalid token."
      })
    );
  }
};
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json(createResponse({
      success: false,
      message: 'Admin access required.'
    }));
  }
  next();
};
export const requireOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'owner') {
    return res.status(403).json(createResponse({
      success: false,
      message: 'Owner access required.'
    }));
  }
  next();
};
export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'user') {
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
