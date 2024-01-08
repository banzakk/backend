import { Test, TestingModule } from '@nestjs/testing';
import { UserWhisperController } from './user-whisper.controller';
import { UserWhisperService } from './user-whisper.service';

describe('UserWhisperController', () => {
  let controller: UserWhisperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWhisperController],
      providers: [UserWhisperService],
    }).compile();

    controller = module.get<UserWhisperController>(UserWhisperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
