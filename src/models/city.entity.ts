import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from '.';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6,
  })
  name: string;

  @OneToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state: State;
}
