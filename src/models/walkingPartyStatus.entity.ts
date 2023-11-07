import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('walking_party_status')
export class walkingPartyStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
