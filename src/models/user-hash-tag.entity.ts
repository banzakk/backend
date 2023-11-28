import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HashTag, User } from '.';

@Entity('user_hash_tags')
export class UserHashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HashTag, (hashTag) => hashTag.user_hash_tags)
  @JoinColumn({ name: 'hash_tag_id' })
  hash_tag: HashTag;

  @ManyToOne(() => User, (user) => user.user_hash_tags)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
