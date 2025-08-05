import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../../../config';
import { createResponse } from '../../../utils/createResponse';
declare global {
  namespace Express {
    interface Request {
      admin?: any;
    }
  }
}
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json(createResponse({
        success: false,
        message: 'Access denied. No token provided.'
      }));
    }
    
    const decoded = jwt.verify(token, config.jwtSecret);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json(createResponse({
      success: false,
      message: 'Invalid token.'
    }));
  }
};
