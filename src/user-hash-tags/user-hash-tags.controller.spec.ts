import { Test, TestingModule } from '@nestjs/testing';
import { UserHashTagsController } from './user-hash-tags.controller';
import { UserHashTagsService } from './user-hash-tags.service';

describe('UserHashTagsController', () => {
  let controller: UserHashTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHashTagsController],
      providers: [UserHashTagsService],
    }).compile();

    controller = module.get<UserHashTagsController>(UserHashTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
