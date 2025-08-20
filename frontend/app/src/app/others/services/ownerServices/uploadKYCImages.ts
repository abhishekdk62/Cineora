export interface UploadResult {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
}

export async function uploadKYCImage(
  file: File, 
  folder: string,
  backendUrl: string = 'http://localhost:5000/api'
): Promise<UploadResult> {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    
    const signResponse = await fetch(`${backendUrl}/sign-cloudinary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folder,
        timestamp,
      }),
    });

    if (!signResponse.ok) {
      throw new Error('Failed to get upload signature');
    }

    const { signature, api_key, cloud_name } = await signResponse.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result = await response.json();

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file. Please try again.'
    };
  }
}

export async function uploadMultipleKYCImages(
  files: { file: File; type: string }[],
  backendUrl: string = 'http://localhost:5000/api'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(({ file, type }) => 
    uploadKYCImage(file, `kyc/${type}`, backendUrl)
  );
  
  return Promise.all(uploadPromises);
}
