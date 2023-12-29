import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateUserProfileImageDto } from './dto/create-user-profile-image.dto';
import { UserProfileImagesService } from './user-profile-images.service';

@Controller('/users/profile-image')
export class UserProfileImagesController {
  constructor(
    private readonly userProfileImagesService: UserProfileImagesService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  async create(
    @Body(ValidationPipe) createUserProfileImageDto: CreateUserProfileImageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @UploadedFiles() imageBuffers: Array<Express.Multer.File>,
    @UploadedFiles() fileNames: Array<Express.Multer.File>,
    @UploadedFiles() fileMimeTypes: Array<Express.Multer.File>,
    @UploadedFiles() fileSize: Array<Express.Multer.File>,
  ) {
    const { userCustomId } = createUserProfileImageDto;
    const [imageUrl] =
      await this.userProfileImagesService.createUserProfileImage(
        files,
        imageBuffers,
        fileNames,
        fileMimeTypes,
        fileSize,
      );
    await this.userProfileImagesService.saveUserProfileImageTransaction(
      imageUrl,
      userCustomId,
    );
  }
}
