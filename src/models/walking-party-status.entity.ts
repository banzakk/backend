import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('walking_party_status')
export class WalkingPartyStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6 })
  name: string;
}
