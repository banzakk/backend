import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserHashTag } from '@src/models';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserHashTag])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
