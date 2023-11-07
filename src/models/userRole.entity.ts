import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_roles')
export class userRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;
}
