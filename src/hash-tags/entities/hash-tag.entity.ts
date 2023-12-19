import { HashTagStatus } from '@src/hash-tag-status/entities/hash-tag-status.entity';
import { UserHashTag, WhisperHashTag } from '@src/models';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hash_tags')
export class HashTags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @ManyToOne(() => HashTagStatus, (hashTagStatus) => hashTagStatus.hash_tags)
  @JoinColumn({ name: 'hash_tag_status_id' })
  hash_tag_status: HashTagStatus;

@OneToMany(() => WhisperHashTag, (whisperHashTag) => whisperHashTag.hash_tag)
  whisper_hash_tags: WhisperHashTag[];

  @OneToMany(() => UserHashTag, (userHashTag) => userHashTag.hash_tag)
  user_hash_tags: UserHashTag[];
}
