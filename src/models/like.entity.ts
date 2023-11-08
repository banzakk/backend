import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User, Whisper } from '.';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rewhispers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Whisper, (whisper) => whisper.rewhispers)
  @JoinColumn({ name: 'whisper_id' })
  whisper: Whisper;
}
