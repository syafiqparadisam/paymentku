import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
// import CircuitBreaker from 'opossum';

@Injectable()
export class CloudinaryService {
  async uploadImage(filePath: string): Promise<UploadApiResponse> {
    try {
      const result = await v2.uploader.upload(filePath, {
        transformation: {
          width: 300,
          height: 300,
          gravity: 'center',
          crop: 'crop',
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
      console.log('publicidimg', publicIdImg);
      await v2.uploader.destroy(publicIdImg, { resource_type: 'image' });
    } catch (error) {
      throw error;
    }
  }
}
