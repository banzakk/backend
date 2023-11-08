import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User, walkingPartyStatus } from '.';

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
  @JoinColumn()
  user: User;

  @OneToOne(() => walkingPartyStatus)
  @JoinColumn()
  walking_party_status: walkingPartyStatus;
}
