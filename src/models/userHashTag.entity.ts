import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HashTag, User } from '.';

@Entity('user_hash_tags')
export class UserHashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.user_hash_tags)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => HashTag, (hashTag) => hashTag.users)
  @JoinColumn({ name: 'hash_tag_id' })
  hashtags: HashTag;
}
