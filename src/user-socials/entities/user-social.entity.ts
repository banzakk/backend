import { Social } from '@src/socials/entities/social.entity';
import { User } from '@src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('user_socials')
export class UserSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  email: string;

  @ManyToOne(() => User, (user) => user.user_socials)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Social, (social) => social.users)
  @JoinColumn({ name: 'social_id' })
  socials: Social;
}
