import { Test, TestingModule } from '@nestjs/testing';
import { UserSocialsService } from './user-socials.service';

describe('UserSocialsService', () => {
  let service: UserSocialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSocialsService],
    }).compile();

    service = module.get<UserSocialsService>(UserSocialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
