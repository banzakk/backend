import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '.';

@Entity('blocks')
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.blockings)
  @JoinColumn()
  bloking_user: User;

  @ManyToOne(() => User, (user) => user.blockeds)
  @JoinColumn()
  blocked_user: User;

  @CreateDateColumn()
  created_at: Date;
}
