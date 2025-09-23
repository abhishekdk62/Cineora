import OWNER_KYC from "../../constants/ownerConstants/kycConstants";
interface kycResponse{

}
export async function uploadKYCImage(
  file: File,
  folder: string,
  backendUrl: string = "http://localhost:5000/api"
): Promise<kycResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const uploadUrl = `${backendUrl}${OWNER_KYC.UPLOAD}`;

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
