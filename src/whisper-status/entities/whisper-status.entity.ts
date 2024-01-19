import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('whisper_status')
export class WhisperStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1 })
  delete_status: string;
}
