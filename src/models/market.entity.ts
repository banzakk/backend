import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('markets')
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  // product Id
}
