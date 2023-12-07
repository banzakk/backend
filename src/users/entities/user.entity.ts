import { UserSocial } from '@src/user-socials/entities/user-social.entity';
import { Whisper } from '@src/whispers/entities/whisper.entity';
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
  WalkingParty,
  WalkingPartyUser,
} from '../../models';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @Column({ length: 14, nullable: true })
  user_custom_id: string;

  @Column({ length: 200, nullable: true })
  password: string;

  @Column({ length: 50, nullable: true })
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

  @OneToMany(() => WalkingParty, (walkingParty) => walkingParty.user, {
    nullable: true,
  })
  walking_parties: WalkingParty[];

  @OneToMany(() => Like, (like) => like.user, {
    nullable: true,
  })
  likes: Like[];

  @OneToMany(() => Whisper, (whisper) => whisper.user, {
    nullable: true,
  })
  whispers: Whisper[];

  @OneToMany(() => Rewhisper, (rewhisper) => rewhisper.user, {
    nullable: true,
  })
  rewhispers: Rewhisper[];

  @OneToMany(
    () => UserMessageRoom,
    (userMessageRoom) => userMessageRoom.sender,
    {
      nullable: true,
    },
  )
  sender: UserMessageRoom[];

  @OneToMany(
    () => UserMessageRoom,
    (userMessageRoom) => userMessageRoom.receiver,
    {
      nullable: true,
    },
  )
  receiver: UserMessageRoom[];

  @OneToMany(() => UserHashTag, (userHashTag) => userHashTag.user, {
    nullable: true,
  })
  user_hash_tags: UserHashTag[];

  @OneToMany(
    () => WalkingPartyUser,
    (walkingPartyUser) => walkingPartyUser.user,
    {
      nullable: true,
    },
  )
  walking_party_users: WalkingPartyUser[];
}
