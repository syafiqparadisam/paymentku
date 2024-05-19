import cloudinary from 'cloudinary';

export const CloudinaryProvider = {
  provide: "cloudinary",
  useFactory: () => {
    return cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUDNAME,
      api_key: process.env.CLOUDINARY_APIKEY,
      api_secret: process.env.CLOUDINARY_APISECRET,
    });
  },
};

export const allowedFile = ["image/jpeg", "image/png", "image/bmp", "image/webp"];
