import {
  BadRequestException,
  Controller,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '@src/decorators/public.decorator';
import { UserProfileImagesService } from './user-profile-images.service';

@Controller('/users/profile-image')
export class UserProfileImagesController {
  constructor(
    private readonly userProfileImagesService: UserProfileImagesService,
  ) {}

  @Public()
  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  async create(
    @Request() req,
    @UploadedFiles() image,
    @UploadedFiles() imageBuffers,
    @UploadedFiles() fileNames,
    @UploadedFiles() fileMimeTypes,
    @UploadedFiles() fileSize,
  ) {
    try {
      if (image.length === 0)
        throw new BadRequestException('이미지가 없습니다.');
      const { userCustomId } = req.body;
      const [imageUrl] =
        await this.userProfileImagesService.createUserProfileImage(
          image,
          imageBuffers,
          fileNames,
          fileMimeTypes,
          fileSize,
        );
      await this.userProfileImagesService.saveUserProfileImageTransaction(
        imageUrl,
        userCustomId,
      );

      return { message: '이미지 업데이트에 성공했습니다.' };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
