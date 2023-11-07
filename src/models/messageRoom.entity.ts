import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClosedMessageRoomStatus, Message, UserMessageRoom } from '.';

@Entity('message_rooms')
export class MessageRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Message, (message) => message.message_room)
  messages: Message[];

  @OneToOne(() => ClosedMessageRoomStatus)
  @JoinColumn()
  sender_status: ClosedMessageRoomStatus;

  @OneToOne(() => ClosedMessageRoomStatus)
  @JoinColumn()
  receiver_status: ClosedMessageRoomStatus;

  @OneToMany(
    () => UserMessageRoom,
    (userMessageRoom) => userMessageRoom.message_room,
  )
  user_message_rooms: UserMessageRoom[];
}
