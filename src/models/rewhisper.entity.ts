import { User } from '@src/users/entities/user.entity';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
