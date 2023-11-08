import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deleted_whispers')
export class DeletedWhisper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1 })
  delete_status: string;
}
