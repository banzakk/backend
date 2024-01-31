import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@src/users/users.module';
import { WhispersModule } from '@src/whispers/whispers.module';
import { Like } from './entities/like.entity';
import { LikeService } from './like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    forwardRef(() => WhispersModule),
    UsersModule,
  ],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
