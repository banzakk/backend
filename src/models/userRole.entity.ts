import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 8 })
  type: string;
}
