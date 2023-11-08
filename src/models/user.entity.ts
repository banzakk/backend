import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Block,
  Follow,
  Like,
  Market,
  Message,
  Rewhisper,
  State,
  UserHashTag,
  UserMessageRoom,
  UserProfileImage,
  UserRole,
  UserSocial,
  WalkingParty,
  WalkingPartyUser,
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

  @OneToMany(() => UserSocial, (userSocial) => userSocial.user)
  user_socials: UserSocial;

  @OneToOne(() => UserRole)
  @JoinColumn({ name: 'user_role_id' })
  user_role_id: UserRole;

  @OneToOne(() => UserProfileImage)
  @JoinColumn({ name: 'user_profile_image_id' })
  user_profile_image: UserProfileImage;

  @OneToOne(() => Market)
  @JoinColumn({ name: 'market_id' })
  market: Market;

  @OneToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @OneToMany(() => Follow, (follow) => follow.following, {
    nullable: true,
  })
  followings: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower, {
    nullable: true,
  })
  followers: Follow[];

  @OneToMany(() => Block, (block) => block.bloking, { nullable: true })
  blockings: Block[];

  @OneToMany(() => Block, (block) => block.blocked, { nullable: true })
  blockeds: Block[];

  @OneToMany(() => Message, (message) => message.user, { nullable: true })
  messages: Message[];

  @OneToMany(() => WalkingParty, (walkingParty) => walkingParty.user)
  walking_parties: WalkingParty[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Whisper, (whisper) => whisper.user)
  whispers: Whisper[];

  @OneToMany(() => Rewhisper, (rewhisper) => rewhisper.user)
  rewhispers: Rewhisper[];

  @OneToMany(() => UserMessageRoom, (userMessageRoom) => userMessageRoom.sender)
  sender: UserMessageRoom[];

  @OneToMany(
    () => UserMessageRoom,
    (userMessageRoom) => userMessageRoom.receiver,
  )
  receiver: UserMessageRoom[];

  @OneToMany(() => UserHashTag, (userHashTag) => userHashTag.user)
  user_hash_tags: UserHashTag[];

  @OneToMany(
    () => WalkingPartyUser,
    (walkingPartyUser) => walkingPartyUser.user,
  )
  walking_party_users: WalkingPartyUser[];
}
