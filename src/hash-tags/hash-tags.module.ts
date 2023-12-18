import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTagStatus } from '@src/hash-tag-status/entities/hash-tag-status.entity';
import { HashTags } from './entities/hash-tag.entity';
import { HashTagsService } from './hash-tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([HashTags, HashTagStatus])],
  providers: [HashTagsService],
  exports: [HashTagsService],
})
export class HashTagsModule {}
