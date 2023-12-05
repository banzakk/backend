import { User } from '@src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Social } from '.';
@Entity('user_socials')
export class UserSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.user_socials)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Social, (social) => social.users)
  @JoinColumn({ name: 'social_id' })
  socials: Social;
}
