import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('whisper_deleted_status')
export class WhisperDeletedStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1 })
  delete_status: string;
}
