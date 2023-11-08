import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MessageRoom, User } from '.';

@Entity('user_message_rooms')
export class UserMessageRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sender)
  @JoinColumn()
  sender_id: User;

  @ManyToOne(() => User, (user) => user.receiver)
  @JoinColumn()
  receiver_id: User;

  @ManyToOne(() => MessageRoom, (messageRoom) => messageRoom.user_message_rooms)
  @JoinColumn()
  message_room: MessageRoom;
}
