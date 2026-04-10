"use server";

import { v2 as cloudinary } from "cloudinary";
import { GenerateSignatureDTO } from "../lib/types";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
const CLOUDINARY_UPLOAD_FOLDER = process.env.CLODINARY_UPLOAD_FOLDER || "";

export const generateCloudinarySignatureAction = async (
  input: GenerateSignatureDTO,
) => {
  const { file_size, content_type } = input;
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    ".jpg",
    ".jpeg",
    ".png",
  ];

  if (!allowedImageTypes.includes(content_type)) {
    throw new Error("Invalid file type. Only image types are allowed.");
  }

  if (file_size > 500000) {
    throw new Error("Image cannot exceed 500KB.");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  const paramsToSign = {
    timestamp: Math.floor(new Date().getTime() / 1000),
    folder: CLOUDINARY_UPLOAD_FOLDER,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    CLOUDINARY_API_SECRET,
  );

  return {
    signature: signature,
    apiKey: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
    timestamp: paramsToSign.timestamp,
    folder: paramsToSign.folder,
  };
};
