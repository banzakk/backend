import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '.';

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn()
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn()
  following: User;

  @CreateDateColumn()
  created_at: Date;
}
