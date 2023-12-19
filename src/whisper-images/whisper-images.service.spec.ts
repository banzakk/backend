import { Test, TestingModule } from '@nestjs/testing';
import { WhisperImagesService } from './whisper-images.service';

describe('WhisperImagesService', () => {
  let service: WhisperImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhisperImagesService],
    }).compile();

    service = module.get<WhisperImagesService>(WhisperImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
