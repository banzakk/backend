import { User } from '@src/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { HashTag } from '../../models';

@Entity('user_hash_tags')
@Unique(['hash_tag', 'user'])
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
