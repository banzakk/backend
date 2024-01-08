import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileImagesService } from './user-profile-images.service';

describe('UserProfileImagesService', () => {
  let service: UserProfileImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProfileImagesService],
    }).compile();

    service = module.get<UserProfileImagesService>(UserProfileImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
