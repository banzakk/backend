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
  @JoinColumn({ name: 'following_user_id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'followed_user_id' })
  following: User;

  @CreateDateColumn()
  created_at: Date;
}
