import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_profile_images')
export class UserProfileImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
}
