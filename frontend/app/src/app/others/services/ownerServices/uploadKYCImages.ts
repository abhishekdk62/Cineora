import OWNER_KYC from "../../constants/ownerConstants/kycConstants";

export interface KycUploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
}

export async function uploadKYCImage(
  file: File,
  folder: string,
  _backendUrl?: string
): Promise<KycUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const uploadUrl = `${
      process.env.NEXT_PUBLIC_NODE_ENV == "dev"
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : process.env.NEXT_PUBLIC_API_BASE_URL_PROD
    }${OWNER_KYC.UPLOAD}`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const result = await response.json();
    return {
      success: true,
      url: result.data.public_id,
      public_id: result.data.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload file. Please try again.",
    };
  }
}
