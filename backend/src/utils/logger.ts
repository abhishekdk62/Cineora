import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const logDir = 'logs';

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

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`); 
  next();
};

export const errorLogger = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message);   
  res.status(err.status || 500).send('Internal Server Error');
};
