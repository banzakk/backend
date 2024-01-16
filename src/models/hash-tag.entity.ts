import { UserHashTag } from '@src/user-hash-tags/entities/user-hash-tag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WhisperHashTag } from '.';

@Entity('hash_tags')
export class HashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @OneToMany(() => WhisperHashTag, (whisperHashTag) => whisperHashTag.hash_tag)
  whisper_hash_tags: WhisperHashTag[];

  @OneToMany(() => UserHashTag, (userHashTag) => userHashTag.hash_tag)
  user_hash_tags: UserHashTag[];
}
