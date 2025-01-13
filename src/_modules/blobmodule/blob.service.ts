import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { put } from '@vercel/blob';
import { Image } from '../../_entities/image.entity';

@Injectable()
export class BlobService {
  private readonly logger = new Logger(BlobService.name);

  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    try {
      this.logger.log('Uploading file to Vercel Blob storage...');
      const blob = await put(file.originalname, file.buffer, {
        access: 'public',
      });
      this.logger.log('File uploaded successfully');

      // Create a new Image entity
      const image = new Image();
      image.filename = file.originalname;
      image.url = blob.url;

      // Save the image information to the database
      const savedImage = await this.imageRepository.save(image);
      this.logger.log(
        `Image information saved to database with ID: ${savedImage.id}`,
      );

      return savedImage;
    } catch (error) {
      this.logger.error(`Failed to upload image: ${error.message}`);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}
