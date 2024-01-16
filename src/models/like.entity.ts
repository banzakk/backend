import { User } from '@src/users/entities/user.entity';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Whisper, (whisper) => whisper.likes)
  @JoinColumn({ name: 'whisper_id' })
  whisper: Whisper;
}
