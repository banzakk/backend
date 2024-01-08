import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from '@src/image/image.module';
import { UsersModule } from '@src/users/users.module';
import { UserProfileImage } from './entities/user-profile-image.entity';
import { UserProfileImagesController } from './user-profile-images.controller';
import { UserProfileImagesService } from './user-profile-images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfileImage]),
    ImageModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [UserProfileImagesController],
  providers: [UserProfileImagesService],
  exports: [UserProfileImagesService],
})
export class UserProfileImagesModule {}
