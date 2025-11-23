import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload options for different upload types
 */
const UPLOAD_OPTIONS = {
  post: {
    folder: "social-feed/posts",
    transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
  profile: {
    folder: "social-feed/profiles",
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
  comment: {
    folder: "social-feed/comments",
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
} as const;

export type UploadType = keyof typeof UPLOAD_OPTIONS;

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param type - Type of upload (post, profile, comment)
 * @returns Upload result with URL and public ID
 */
export async function uploadImage(
  file: string | Buffer,
  type: UploadType = "post"
) {
  try {
    const options = UPLOAD_OPTIONS[type];

    const result = await cloudinary.uploader.upload(
      file instanceof Buffer ? `data:image/jpeg;base64,${file.toString("base64")}` : file,
      options
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Get optimized image URL
 * @param publicId - Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
) {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
}

export default cloudinary;

