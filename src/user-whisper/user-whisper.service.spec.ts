import { Test, TestingModule } from '@nestjs/testing';
import { UserWhisperService } from './user-whisper.service';

describe('UserWhisperService', () => {
  let service: UserWhisperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWhisperService],
    }).compile();

    service = module.get<UserWhisperService>(UserWhisperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
