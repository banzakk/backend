import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MessageRoom } from '.';
import { User } from '../users/entities/user.entity';

@Entity('user_message_rooms')
export class UserMessageRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sender)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receiver)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ManyToOne(() => MessageRoom, (messageRoom) => messageRoom.user_message_rooms)
  @JoinColumn({ name: 'message_room_id' })
  message_room: MessageRoom;
}
