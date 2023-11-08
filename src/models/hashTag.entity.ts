import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserHashTag, WhisperHashTag } from '.';

@Entity('hash_tags')
export class HashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @OneToMany(() => UserHashTag, (userHashTag) => userHashTag.user)
  users: UserHashTag[];

  @OneToMany(() => WhisperHashTag, (whisperHashTag) => whisperHashTag.hashTag)
  whisper_hash_tags: WhisperHashTag[];
}
