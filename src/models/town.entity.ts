import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('towns')
export class Town {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
