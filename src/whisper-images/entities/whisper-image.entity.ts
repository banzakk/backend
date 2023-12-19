import { Whisper } from '@src/whispers/entities/whisper.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('whisper_images')
export class WhisperImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Whisper, (whisper) => whisper.whisper_images, {
    nullable: false,
  })
  @JoinColumn({ name: 'whisper_id' })
  whisper: Whisper;
}
