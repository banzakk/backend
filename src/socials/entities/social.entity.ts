import { UserSocial } from '@src/user-socials/entities/user-social.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('socials')
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  type: string;

  @OneToMany(() => UserSocial, (userSocial) => userSocial.user)
  users: UserSocial[];
}
