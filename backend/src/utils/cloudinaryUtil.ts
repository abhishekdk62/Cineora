import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinaryConfig';
export interface CloudinaryUploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * @param input - 
 * @param options - 
 * @returns  
 */
export const uploadToCloudinary = async (
  input: string | Express.Multer.File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadOptions: any = {
      folder: options.folder || 'uploads',
      type: 'authenticated', 
      resource_type: options.resource_type || 'image',
      transformation: []
    };

    if (options.width || options.height) {
      uploadOptions.transformation.push({
        width: options.width || options.height,
        height: options.height || options.width,
        crop: options.crop || 'fill'
      });
    }

    if (options.quality) {
      uploadOptions.transformation.push({
        quality: options.quality
      });
    }

    let result: UploadApiResponse;

    if (typeof input === 'string') {
      if (!input.startsWith('data:image')) {
        throw new Error('Invalid base64 image format');
      }
      
      console.log('Uploading base64 image to Cloudinary...');
      result = await cloudinary.uploader.upload(input, uploadOptions);
      
    } else if (input && input.path) {
      console.log('Uploading multer file to Cloudinary:', input.originalname);
      result = await cloudinary.uploader.upload(input.path, {
        ...uploadOptions,
        original_filename: input.originalname.split('.')[0]
      });
      
      const fs = require('fs');
      if (fs.existsSync(input.path)) {
        fs.unlinkSync(input.path);
        console.log('Temporary file cleaned up:', input.path);
      }
      
    } else {
      throw new Error('Invalid input: expected base64 string or multer file object');
    }

    console.log('Cloudinary upload successful:', result.public_id);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * @param files - 
 * @param options - 
 * @returns 
 */
export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult[]> => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload');
    }

    console.log(`Uploading ${files.length} files to Cloudinary...`);

    // Upload all files in parallel
    const uploadPromises = files.map((file, index) => {
      const fileOptions = {
        ...options,
        folder: `${options.folder || 'uploads'}/${Date.now()}_${index}`
      };
      return uploadToCloudinary(file, fileOptions);
    });

    const results = await Promise.all(uploadPromises);
    console.log(`Successfully uploaded ${results.length} files`);
    
    return results;

  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error(`Multiple file upload failed: ${error.message}`);
  }
};

export const generateSignedUrl = (
  publicId: string,
  options: CloudinaryUploadOptions = {}
): string | null => { 
  try {
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    const urlOptions: any = {
      type: 'authenticated',
      sign_url: true,
      transformation: []
    };

    if (options.width || options.height) {
      urlOptions.transformation.push({
        width: options.width || 200,
        height: options.height || 200,
        crop: options.crop || 'fill'
      });
    }

    return cloudinary.url(publicId, urlOptions);

  } catch (error) {
    console.error('Generate signed URL error:', error);
    return null; 
  }
};


