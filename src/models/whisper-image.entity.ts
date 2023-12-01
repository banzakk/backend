import { Whisper } from '@src/whispers/entities/whisper.entity';
import {
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

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Whisper, (whisper) => whisper.whisper_images)
  @JoinColumn({ name: 'whisper_id' })
  whisper: Whisper;
}
