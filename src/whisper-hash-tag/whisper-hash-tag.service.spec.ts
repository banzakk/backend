import { Test, TestingModule } from '@nestjs/testing';
import { WhisperHashTagService } from './whisper-hash-tag.service';

describe('WhisperHashTagService', () => {
  let service: WhisperHashTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhisperHashTagService],
    }).compile();

    service = module.get<WhisperHashTagService>(WhisperHashTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
