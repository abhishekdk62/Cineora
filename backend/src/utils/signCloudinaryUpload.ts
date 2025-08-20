const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const signCloudinaryUpload = async (req, res) => {
  try {
    const { folder, timestamp } = req.body;
    if (!timestamp ) {
      return res.status(400).json({ 
        error: 'Missing  parameter timestamp' 
      });
    }

    if (!folder ) {
      return res.status(400).json({ 
        error: 'Missing required parameter folder' 
      });
    }


    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign, 
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      timestamp, 
    });

  } catch (error) {
    console.error('Error signing Cloudinary upload:', error);
    return res.status(500).json({ 
      error: 'Failed to generate signature for upload' 
    });
  }
};
