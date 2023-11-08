import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('hash_tags')
export class HashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @ManyToMany(() => User, (user) => user.hashtags)
  users: User[];
}
