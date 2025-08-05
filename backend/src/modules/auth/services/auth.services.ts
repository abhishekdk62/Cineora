import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../../user/repositories/user.repository';
import { AdminRepository } from '../../admin/repositories/admin.repository';
import { OwnerRepository } from '../../owner/repositories/owner.repository';
import { config } from '../../../config';

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
    role: 'user' | 'admin' | 'owner';
    redirectTo: string;
  };
}

export class AuthService {
  private userRepo = new UserRepository();
  private adminRepo = new AdminRepository();
  private ownerRepo = new OwnerRepository();

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const admin = await this.adminRepo.findByEmail(email);
      if (admin) {
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
          return { success: false, message: 'Invalid credentials' };
        }
        const token = jwt.sign(
          { 
            id: admin._id,
            adminId: admin._id, 
            email: admin.email, 
            role: 'admin' 
          },
          config.jwtSecret,
          { expiresIn: config.jwtExpiresIn }
        );
        return {
          success: true,
          message: 'Admin login successful',
          data: {
            user: {
              id: admin._id,
              email: admin.email,
              role: 'admin'
            },
            token,
            role: 'admin',
            redirectTo: '/admin/dashboard'
          }
        };
      }
      const owner = await this.ownerRepo.findByEmail(email);
      if (owner) {
        const isValidPassword = await bcrypt.compare(password, owner.password);
        
        if (!isValidPassword) {
          return { success: false, message: 'Invalid credentials' };
        }

        if (!owner.isActive) {
          return { success: false, message: 'Your account has been blocked. Please contact support.' };
        }

        if (!owner.isVerified) {
          return { success: false, message: 'Your account is not verified yet.' };
        }

        const token = jwt.sign(
          { 
            id: owner._id,
            ownerId: owner._id, 
            email: owner.email, 
            role: 'owner' 
          },
          config.jwtSecret,
          { expiresIn: config.jwtExpiresIn }
        );

        await this.ownerRepo.updateLastLogin(owner._id);

        return {
          success: true,
          message: 'Owner login successful',
          data: {
            user: {
              id: owner._id,
              ownerName: owner.ownerName,
              email: owner.email,
              phone: owner.phone,
              isVerified: owner.isVerified,
              isActive: owner.isActive,
              role: 'owner'
            },
            token,
            role: 'owner',
            redirectTo: '/owner/dashboard'
          }
        };
      }

      const user = await this.userRepo.findByEmail(email);
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return { success: false, message: 'Invalid credentials' };
        }

        if (!user.isVerified) {
          return { success: false, message: 'Please verify your email before logging in' };
        }

        if (!user.isActive) {
          return { success: false, message: 'Your account has been blocked. Please contact support.' };
        }

        // Generate JWT token for user
        const token = jwt.sign(
          { 
            id: user._id,
            userId: user._id, 
            email: user.email, 
            role: 'user' 
          },
          config.jwtSecret,
          { expiresIn: config.jwtExpiresIn }
        );

        // Update last active
        await this.userRepo.updateLastActive(user._id);

        return {
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              isVerified: user.isVerified,
              xpPoints: user.xpPoints,
              role: 'user'
            },
            token,
            role: 'user',
            redirectTo: '/dashboard' 
          }
        };
      }

      return { success: false, message: 'No account found with this email address' };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Something went wrong during login' };
    }
  }
}
