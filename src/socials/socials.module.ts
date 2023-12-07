import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Social } from './entities/social.entity';
import { SocialsService } from './socials.service';

@Module({
  imports: [TypeOrmModule.forFeature([Social])],
  providers: [SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
