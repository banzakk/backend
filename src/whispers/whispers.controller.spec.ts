import { Test, TestingModule } from '@nestjs/testing';
import { WhispersController } from './whispers.controller';
import { WhispersService } from './whispers.service';

describe('WhispersController', () => {
  let controller: WhispersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhispersController],
      providers: [WhispersService],
    }).compile();

    controller = module.get<WhispersController>(WhispersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
