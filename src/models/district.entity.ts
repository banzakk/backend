import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '.';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6,
  })
  name: string;

  @OneToOne(() => City)
  @JoinColumn()
  city: City;
}
