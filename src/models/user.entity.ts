import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HashTag } from './hashTag.entity';
import { Market } from './market.entity';
import { Social } from './social.entity';
import { State } from './state.entity';
import { UserProfileImage } from './userProfileImage.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @Column()
  user_custom_id: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column()
  uid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Social, (social) => social.users)
  @JoinTable()
  socials: Social[];

  @OneToMany(() => HashTag, (hashtag) => hashtag.user)
  hashtags: HashTag[];

  @OneToOne(() => UserProfileImage)
  @JoinColumn()
  user_profile_image: UserProfileImage;

  @OneToOne(() => Market)
  @JoinColumn()
  market: Market;

  @OneToOne(() => State)
  @JoinColumn()
  state: State;
}
