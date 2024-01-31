import { Like } from '@src/like/entities/like.entity';
import { User } from '@src/users/entities/user.entity';
import { WhisperDeletedStatus } from '@src/whisper-deleted-status/entities/whisper-deleted-status.entity';
import { WhisperImage } from '@src/whisper-images/entities/whisper-image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rewhisper, WhisperHashTag } from '../../models';

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

  @ManyToOne(() => WhisperDeletedStatus)
  @JoinColumn({ name: 'whisper_deleted_status_id' })
  whisper_status: WhisperDeletedStatus;

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
