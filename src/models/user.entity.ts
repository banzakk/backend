import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HashTag } from './hashTag.entity';
import { Social } from './social.entity';

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

  @Column()
  user_profile_image_id: number;

  @Column()
  market_id: number;

  @Column()
  state_id: number;
}
