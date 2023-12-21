import { Test, TestingModule } from '@nestjs/testing';
import { UserHashTagsService } from './user-hash-tags.service';

describe('UserHashTagsService', () => {
  let service: UserHashTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHashTagsService],
    }).compile();

    service = module.get<UserHashTagsService>(UserHashTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
