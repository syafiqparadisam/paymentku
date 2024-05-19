import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from 'src/config/cloudinary-options';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService,CloudinaryProvider]
})
export class CloudinaryModule { }
