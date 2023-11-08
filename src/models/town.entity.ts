import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from '.';

@Entity('towns')
export class Town {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6,
  })
  name: string;

  @OneToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;
}
