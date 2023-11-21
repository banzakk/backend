import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WalkingParty } from '.';
import { User } from '../users/entities/user.entity';

@Entity('walking_party_users')
export class WalkingPartyUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.walking_party_users)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => WalkingParty,
    (walkingParty) => walkingParty.walking_party_users,
  )
  @JoinColumn({ name: 'walking_party_id' })
  walking_party: WalkingParty;
}
