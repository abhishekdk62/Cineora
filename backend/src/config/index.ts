import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  serverPort: Number(process.env.SERVER_PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mydb",

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "sdhfjsdhfuwye",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "sdfsdfsdfsdfsd",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,

  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },

  otpExpiry: 5 * 60 * 1000,

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX) || 100,

  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 5000000,
  allowedFileTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
};
