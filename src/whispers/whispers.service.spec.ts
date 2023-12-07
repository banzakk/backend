import { Test, TestingModule } from '@nestjs/testing';
import { WhispersService } from './whispers.service';

describe('WhispersService', () => {
  let service: WhispersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhispersService],
    }).compile();

    service = module.get<WhispersService>(WhispersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
