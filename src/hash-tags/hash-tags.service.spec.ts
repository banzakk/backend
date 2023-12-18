import { Test, TestingModule } from '@nestjs/testing';
import { HashTagsService } from './hash-tags.service';

describe('HashTagsService', () => {
  let service: HashTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashTagsService],
    }).compile();

    service = module.get<HashTagsService>(HashTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
