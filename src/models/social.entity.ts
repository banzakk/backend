import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserSocial } from '.';

@Entity('socials')
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @ManyToOne(() => UserSocial, (userSocial) => userSocial.user)
  users: UserSocial[];
}
