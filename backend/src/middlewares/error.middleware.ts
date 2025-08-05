import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../utils/createResponse';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  const status = err.status || 500;
  const resp = createResponse({
    success: false,
    message: err.message || 'Internal server error',
  });
  res.status(status).json(resp);
}
