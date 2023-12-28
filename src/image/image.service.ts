import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class ImageService {
  constructor(@Inject('S3_INSTANCE') private readonly s3: S3) {}

  async createImage(image, imageBuffers, fileNames, fileMimeTypes, fileSize) {
    const imageObjects = image.map((image, index: number) => ({
      buffer: imageBuffers[index].buffer,
      originalname: fileNames[index].originalname,
      mimeType: fileMimeTypes[index].mimetype,
      size: fileSize[index].size,
    }));

    const uploadPromises = imageObjects.map(async (imageObject) => {
      const key = `whisper_images/${Date.now()}_${imageObject.originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: imageObject.buffer,
        ACL: 'private',
        ContentType: imageObject.mimeType,
      };

      const result = await this.s3.upload(params).promise();
      return result.Location;
    });
    const imageUrl: string[] = await Promise.all(uploadPromises);
    return imageUrl;
  }
}
