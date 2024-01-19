import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTagsModule } from '@src/hash-tags/hash-tags.module';
import { User } from '@src/users/entities/user.entity';
import { UsersModule } from '@src/users/users.module';
import { UserHashTag } from './entities/user-hash-tag.entity';
import { UserHashTagsController } from './user-hash-tags.controller';
import { UserHashTagsService } from './user-hash-tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserHashTag, User]),
    UsersModule,
    HashTagsModule,
  ],
  controllers: [UserHashTagsController],
  providers: [UserHashTagsService],
})
export class UserHashTagsModule {}
