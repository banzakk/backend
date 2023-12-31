import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageService } from '@src/image/image.service';
import { UsersService } from '@src/users/users.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserProfileImage } from './entities/user-profile-image.entity';

@Injectable()
export class UserProfileImagesService {
  constructor(
    private readonly imageService: ImageService,
    @InjectRepository(UserProfileImage)
    private userProfileImageRepository: Repository<UserProfileImage>,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    private dataSource: DataSource,
  ) {}
  async saveUserProfileImageTransaction(url, userCustomId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userService.getUserByCustomId(userCustomId);
      if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
      const image = await this.saveUserProfileImage(url, queryRunner);
      if (!image)
        throw new InternalServerErrorException(
          '이미지 저장 중 오류가 발생했습니다.',
        );
      await this.userService.updateUserProfileImageId(
        user.id,
        image,
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return 'ok';
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createUserProfileImage(
    files,
    imageBuffers,
    fileNames,
    fileMimeTypes,
    fileSize,
  ) {
    try {
      const imageUrl = await this.imageService.createImage(
        files,
        imageBuffers,
        fileNames,
        fileMimeTypes,
        fileSize,
        'profile_images',
      );
      return imageUrl;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '이미지 저장 중 오류가 발생헀습니다.',
      );
    }
  }
  async saveUserProfileImage(url: string, queryRunner: QueryRunner) {
    const userProfileImage = new UserProfileImage();
    userProfileImage.url = url;
    const image = await queryRunner.manager.save(userProfileImage);
    return image;
  }
}
