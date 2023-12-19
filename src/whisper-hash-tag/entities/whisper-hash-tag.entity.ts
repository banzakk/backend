import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('whisper_hash_tags')
export class WhisperHashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HashTags, (hashTag) => hashTag.whisper_hash_tags)
  @JoinColumn({ name: 'hash_tag_id' })
  hash_tag: HashTags;

  @ManyToOne(() => Whisper, (whisper) => whisper.whisper_hash_tags)
  @JoinColumn({ name: 'whisper_id' })
  whisper: Whisper;
}
