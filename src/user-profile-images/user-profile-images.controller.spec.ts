import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileImagesController } from './user-profile-images.controller';
import { UserProfileImagesService } from './user-profile-images.service';

describe('UserProfileImagesController', () => {
  let controller: UserProfileImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileImagesController],
      providers: [UserProfileImagesService],
    }).compile();

    controller = module.get<UserProfileImagesController>(UserProfileImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
