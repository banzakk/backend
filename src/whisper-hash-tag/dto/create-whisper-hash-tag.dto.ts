import { IsInt } from 'class-validator';

export class CreateWhisperHashTagDto {
  @IsInt()
  hashTagId: number;

  @IsInt()
  whisper_id: number;
}
