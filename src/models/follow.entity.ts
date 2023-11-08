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
  follower_user: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn()
  following_user: User;

  @CreateDateColumn()
  created_at: Date;
}
