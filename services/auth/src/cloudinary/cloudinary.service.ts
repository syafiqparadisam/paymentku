import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
// import CircuitBreaker from 'opossum';

@Injectable()
export class CloudinaryService {
  async uploadImage(filePath: string): Promise<UploadApiResponse> {
    try {
      const result = await v2.uploader.upload(filePath, {
        transformation: {
          aspect_ratio: "1.0",
          gravity: 'center',
          crop: 'fill',
        },
        resource_type: 'image',
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(publicIdImg: string) {
    try {
      await v2.uploader.destroy(publicIdImg, { resource_type: 'image' });
    } catch (error) {
      throw error;
    }
  }
}
