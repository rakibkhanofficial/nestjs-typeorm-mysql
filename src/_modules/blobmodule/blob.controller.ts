import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlobService } from './blob.service';

interface UploadedImage {
  id: number;
  filename: string;
  url: string;
  uploadedAt: Date;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
}
@Controller('blob')
export class BlobController {
  constructor(private readonly blobService: BlobService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponse<UploadedImage>> {
    try {
      const savedImage = await this.blobService.uploadImage(file);
      return {
        statusCode: 200,
        message: 'File uploaded successfully',
        data: {
          id: savedImage.id,
          filename: savedImage.filename,
          url: savedImage.url,
          uploadedAt: savedImage.uploadedAt,
        },
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        statusCode: 500,
        message: 'Error uploading file',
        data: null,
      };
    }
  }
}
