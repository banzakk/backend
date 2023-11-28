import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.blockings)
  @JoinColumn({ name: 'blocking_user_id' })
  bloking: User;

  @ManyToOne(() => User, (user) => user.blockeds)
  @JoinColumn({ name: 'blocked_user_id' })
  blocked: User;

  @CreateDateColumn()
  created_at: Date;
}
