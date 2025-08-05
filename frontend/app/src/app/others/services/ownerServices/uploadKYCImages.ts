// app/others/services/ownerServices/uploadKYCImages.ts
export interface UploadResult {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
}

// Simple unsigned upload to Cloudinary
export async function uploadKYCImage(
  file: File, 
  folder: string
): Promise<UploadResult> {
  try {
    const cloudName = 'dxa2aruhc';
    const uploadPreset = 'kyc_uploads';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    console.log('🚀 Uploading to:', `https://api.cloudinary.com/v1_1/${cloudName}/upload`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    console.log("the respones is ",response);
    

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Upload error response:', errorData);
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result = await response.json();
    console.log('✅ Upload success:', result.secure_url);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };

  } catch (error) {
    console.error('💥 Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file. Please try again.'
    };
  }
}

// Batch upload function
export async function uploadMultipleKYCImages(
  files: { file: File; type: string }[]
): Promise<UploadResult[]> {
  const uploadPromises = files.map(({ file, type }) => 
    uploadKYCImage(file, `kyc/${type}`)
  );
  
  return Promise.all(uploadPromises);
}
