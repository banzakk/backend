import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeletedWhisper, User, WhisperImage } from '.';

@Entity('whispers')
export class Whisper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  deleted_at: Date;

  @ManyToMany(() => User, (user) => user.whispers)
  @JoinTable({ name: 'likes' })
  likes: User[];

  @ManyToMany(() => User, (user) => user.whispers)
  @JoinTable({ name: 'rewhispers' })
  rewhispers: User[];

  @OneToOne(() => DeletedWhisper)
  @JoinColumn()
  deleted_whisper: DeletedWhisper;

  @ManyToOne(() => User, (user) => user.whispers)
  @JoinColumn()
  user: User;

  @OneToMany(() => WhisperImage, (whisperImage) => whisperImage.whisper)
  whisper_images: WhisperImage[];
}
