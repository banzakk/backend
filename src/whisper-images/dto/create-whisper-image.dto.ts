import { ValidationMessage } from '@src/utils';
import { IsNotEmpty } from 'class-validator';

const message = ValidationMessage.make();
export class CreateWhisperImageDto {
  @IsNotEmpty(message.notEmpty('위스퍼 이미지는'))
  url: string[];
}
