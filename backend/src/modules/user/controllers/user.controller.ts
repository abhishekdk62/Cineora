import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { createResponse } from '../../../utils/createResponse';

const service = new UserService();

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const userData = req.body;

    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'Username, email and password are required' 
      }));
    }

    const result = await service.signup(userData);
    
    if (!result.success) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    return res.status(201).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function verifyOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'Email and OTP are required' 
      }));
    }

    const result = await service.verifyOTP(email, otp);
    
    if (!result.success) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function resendOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'Email is required' 
      }));
    }

    const result = await service.resendOTP(email);
    
    if (!result.success) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message
    }));
  } catch (err) {
    next(err);
  }
}

export async function getUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'User ID is required' 
      }));
    }

    const result = await service.getUserProfile(id);
    
    if (!result.success) {
      return res.status(404).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.user;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'User ID is required' 
      }));
    }

    const result = await service.updateProfile(id, updateData);
    
    if (!result.success) {
      return res.status(404).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function getNearbyUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { maxDistance } = req.query;

    if (!id) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'User ID is required' 
      }));
    }

    const result = await service.getNearbyUsers(
      id, 
      maxDistance ? parseInt(maxDistance as string) : 5000
    );
    
    if (!result.success) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function addXpPoints(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { points } = req.body;

    if (!id || !points) {
      return res.status(400).json(createResponse({ 
        success: false, 
        message: 'User ID and points are required' 
      }));
    }

    const result = await service.addXpPoints(id, points);
    
    if (!result.success) {
      return res.status(404).json(createResponse({ 
        success: false, 
        message: result.message 
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message
    }));
  } catch (err) {
    next(err);
  }
}




export async function resetPassword(req:Request,res:Response,next:NextFunction){
  try {
    const {id}=req.user
    if(!id)
    {
      return res.status(400).json(createResponse({
        success:false,
        message:"User id is required"
      }))
    }



    
  } catch (error) {
    next(error)
    
  }
}