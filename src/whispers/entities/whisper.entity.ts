import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  DeletedWhisper,
  Rewhisper,
  WhisperHashTag,
  WhisperImage,
} from '../../models';
import { Like } from '../../models/like.entity';
import { User } from '../../models/user.entity';

@Entity('whispers')
export class Whisper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @OneToOne(() => DeletedWhisper)
  @JoinColumn({ name: 'deleted_whisper_id' })
  deleted_whisper: DeletedWhisper;

  @ManyToOne(() => User, (user) => user.whispers, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => WhisperImage, (whisperImage) => whisperImage.whisper)
  whisper_images: WhisperImage[];

  @OneToMany(() => Rewhisper, (rewhisper) => rewhisper.whisper)
  rewhispers: Rewhisper[];

  @OneToMany(() => Like, (like) => like.whisper)
  likes: Like[];

  @OneToMany(() => WhisperHashTag, (whisperHashTag) => whisperHashTag.whisper)
  whisper_hash_tags: WhisperHashTag[];
}
