import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Whisper } from '.';
import { User } from '../users/entities/user.entity';
@Entity('rewhispers')
export class Rewhisper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rewhispers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Whisper, (whisper) => whisper.rewhispers)
  @JoinColumn({ name: 'whisper_id' })
  whisper: Whisper;
}
