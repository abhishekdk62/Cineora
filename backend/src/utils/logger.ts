import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const logDir = 'logs';

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const transport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/app-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

// Create the logger - THIS IS IMPORTANT
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    transport,
    new winston.transports.Console(),
  ],
  exitOnError: false,
});

// Now create the middleware functions that USE the logger
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);  // Now logger exists here
  next();
};

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message);   // Now logger exists here
  res.status(err.status || 500).send('Internal Server Error');
};
