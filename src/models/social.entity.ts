import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserSocial } from '.';

@Entity('socials')
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => UserSocial, (userSocial) => userSocial.user)
  users: UserSocial[];
}
