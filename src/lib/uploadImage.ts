import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File, folder: string) => {
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME && !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            throw new Error("Cloudinary cloud name not configured");
        }
        if (!process.env.CLOUDINARY_API_KEY) {
            throw new Error("Cloudinary API key not configured");
        }
        if (!process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Cloudinary API secret not configured");
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                        return;
                    }
                    resolve(result);
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error("Upload image error:", error);
        throw error;
    }
};
export const uploadPdf = async (file: File, folder: string) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME && !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            throw new Error("Cloudinary cloud name not configured");
        }
        if (!process.env.CLOUDINARY_API_KEY) {
            throw new Error("Cloudinary API key not configured");
        }
        if (!process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Cloudinary API secret not configured");
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: "raw", // required for PDF files
                    access_mode: "public", // ensure file is publicly accessible
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary PDF upload error:", error);
                        reject(error);
                        return;
                    }
                    resolve(result);
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error("Upload PDF error:", error);
        throw error;
    }
};


export const deleteImage = async (publicId: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
};
