import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HashTag, Whisper } from '.';

@Entity('whisper_hash_tags')
export class WhisperHashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HashTag, (hashTag) => hashTag.whisper_hash_tags)
  @JoinColumn({ name: 'hash_tag_id' })
  hash_tag: HashTag;

  @ManyToOne(() => Whisper, (whisper) => whisper.whisper_hash_tags)
  @JoinColumn({ name: 'whisper_id' })
  whisper: Whisper;
}
