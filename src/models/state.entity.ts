import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6,
  })
  name: string;
}
