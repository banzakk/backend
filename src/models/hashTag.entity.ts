import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '.';
import { WhisperHashTag } from './whisperHashTag.entity';

@Entity('hash_tags')
export class HashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @ManyToMany(() => User, (user) => user.hashtags)
  users: User[];

  @OneToMany(() => WhisperHashTag, (whisperHashTag) => whisperHashTag.hashTag)
  whisper_hash_tags: WhisperHashTag[];
}
