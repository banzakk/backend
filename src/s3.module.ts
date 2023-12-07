import { Global, Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Global()
@Module({
  providers: [
    {
      provide: 'S3_INSTANCE',
      useFactory: () => {
        return new S3({
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
          region: process.env.AWS_REGION,
        });
      },
    },
  ],
  exports: ['S3_INSTANCE'],
})
export class S3Module {}
