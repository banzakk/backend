import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hash_tag_status')
export class HashTagStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, nullable: false })
  name: string;

  @OneToMany(() => HashTags, (hashTags) => hashTags.hash_tag_status)
  hash_tags: HashTags[];
}
