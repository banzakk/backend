import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('closed_message_room_status')
export class ClosedMessageRoomStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1 })
  closed_status: string;
}
