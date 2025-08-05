import { Request, Response } from 'express';
const express = require('express');
import * as cookieParser from "cookie-parser";

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

import authRoutes from './modules/auth/routes/auth.routes';          
import userRoutes from './modules/user/routes/user.routes';          
import ownerRoutes from './modules/owner/routes/owner.routes';     
import adminRoutes from './modules/admin/routes/index.routes';                     
import { errorMiddleware } from './middlewares/error.middleware';

// ✅ Import auth middleware for protected routes
import { authenticateToken, requireAdmin, requireUser, requireOwner } from './modules/auth/middleware/auth.middleware';

export const app = express();

app.use(helmet());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan('combined'));
app.use(express.json());

app.use('/api/auth', authRoutes);                  
app.use('/api/users',authenticateToken, userRoutes);                
app.use('/api/owners', ownerRoutes);                

app.use('/api/admin', authenticateToken, requireAdmin, adminRoutes);

// User dashboard routes - require user authentication (if you have user-specific protected routes)
// app.use('/api/user-dashboard', authenticateToken, requireUser, userDashboardRoutes);

// Owner dashboard routes - require owner authentication (if you have owner-specific protected routes)
// app.use('/api/owner-dashboard', authenticateToken, requireOwner, ownerDashboardRoutes);

// ✅ 404 handler
app.use((req: Request, res: Response) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

// ✅ Error handling middleware (should be last)
app.use(errorMiddleware);
