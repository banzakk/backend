import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User, WalkingPartyUser, walkingPartyStatus } from '.';

@Entity('walking_parties')
export class WalkingParty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 4 })
  user_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  deleated_at: Date;

  @ManyToOne(() => User, (user) => user.walking_parties)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => walkingPartyStatus)
  @JoinColumn({ name: 'walking_party_status_id' })
  walking_party_status: walkingPartyStatus;

  @OneToMany(
    () => WalkingPartyUser,
    (walkingPartyUser) => walkingPartyUser.walking_party,
  )
  walking_party_users: WalkingPartyUser[];
}
