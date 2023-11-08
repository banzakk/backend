import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Block,
  Follow,
  HashTag,
  Market,
  Message,
  Social,
  State,
  UserMessageRoom,
  UserProfileImage,
  UserRole,
  WalkingParty,
  Whisper,
} from '.';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @Column({ length: 14 })
  user_custom_id: string;

  @Column({ length: 200 })
  password: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 36 })
  uid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @ManyToMany(() => Social, (social) => social.users)
  @JoinTable()
  socials: Social[];

  @ManyToMany(() => HashTag, (hashtag) => hashtag.users)
  @JoinTable()
  hashtags: HashTag[];

  @OneToOne(() => UserRole)
  @JoinColumn({ name: 'user_role_id' })
  user_role_id: UserRole;

  @OneToOne(() => UserProfileImage)
  @JoinColumn()
  user_profile_image: UserProfileImage;

  @OneToOne(() => Market)
  @JoinColumn()
  market: Market;

  @OneToOne(() => State)
  @JoinColumn()
  state: State;

  @OneToMany(() => Follow, (follow) => follow.following_user, {
    nullable: true,
  })
  followings: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower_user, { nullable: true })
  followers: Follow[];

  @OneToMany(() => Block, (block) => block.bloking_user, { nullable: true })
  blockings: Block[];

  @OneToMany(() => Block, (block) => block.blocked_user, { nullable: true })
  blockeds: Block[];

  @OneToMany(() => Message, (message) => message.user, { nullable: true })
  messages: Message[];

  @ManyToMany(() => WalkingParty, (walkingParty) => walkingParty.user)
  @JoinTable()
  walking_parties: WalkingParty[];

  @OneToMany(() => Whisper, (whisper) => whisper.user)
  whispers: Whisper[];

  @OneToMany(
    () => UserMessageRoom,
    (userMessageRoom) => userMessageRoom.sender_id,
  )
  sender: UserMessageRoom[];

  @OneToMany(
    () => UserMessageRoom,
    (userMessageRoom) => userMessageRoom.receiver_id,
  )
  receiver: UserMessageRoom[];
}
