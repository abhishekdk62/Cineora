import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../../../config";
import { createResponse } from "../../../utils/createResponse";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      admin?: {
        adminId: string;
        email: string;
        role: string;
      };
      owner?: {
        ownerId: string;
        email: string;
        role: string;
      };
      staff?: {
        staffId: string;
        email: string;
        role: string;
      };
      userRole?: "user" | "admin" | "owner" | "staff";
    }
  }
}
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken) {
      return res.status(401).json(
        createResponse({
          success: false,
          message: "Access denied. No token provided.",
        })
      );
    }
    try {
      const decoded = jwt.verify(accessToken, config.jwtAccessSecret);

      setUserFromDecoded(req, decoded);
      return next();
    } catch (error: unknown) {
      return res.status(401).json(
        createResponse({
          success: false,
          message: refreshToken
            ? "Token refresh failed. Please login again."
            : "Invalid token.",
        })
      );
    }
  } catch (error) {
    return res.status(401).json(
      createResponse({
        success: false,
        message: "Authentication failed.",
      })
    );
  }
};

function setUserFromDecoded(req: Request, decoded) {
  switch (decoded.role) {
    case "admin":
      req.admin = {
        adminId: decoded.adminId,
        email: decoded.email,
        role: "admin",
      };
      break;
    case "owner":
      req.owner = {
        ownerId: decoded.ownerId,
        email: decoded.email,
        role: "owner",
      };
      break;
    case "user":
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: "user",
      };
      break;

    case "staff":
      req.staff = {
        staffId: decoded.staffId,
        email: decoded.email,
        role: "staff",
      };
      break;

    default:
      throw new Error("Invalid token role");
  }
}
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (req.admin.role !== "admin") {
    return res.status(403).json(
      createResponse({
        success: false,
        message: "Admin access required.",
      })
    );
  }
  next();
};

export const requireOwner = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.owner.role !== "owner") {
    return res.status(403).json(
      createResponse({
        success: false,
        message: "Owner access required.",
      })
    );
  }
  next();
};
export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== "user") {
    return res.status(403).json(
      createResponse({
        success: false,
        message: "User access required.",
      })
    );
  }
  next();
};
export const requireStaff = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.staff || req.staff.role !== "staff") {
    return res.status(403).json(
      createResponse({
        success: false,
        message: "Staff access required.",
      })
    );
  }
  next();
};

export const requireAnyRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json(
        createResponse({
          success: false,
          message: `Access denied. Required roles: ${roles.join(", ")}`,
        })
      );
    }
    next();
  };
};
