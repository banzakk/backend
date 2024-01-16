import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSocial } from './entities/user-social.entity';
import { UserSocialsService } from './user-socials.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSocial])],
  providers: [UserSocialsService],
  exports: [UserSocialsService],
})
export class UserSocialsModule {}
