import { ValidationMessage } from '@src/utils';
import { IsNotEmpty, IsString } from 'class-validator';

const message = ValidationMessage.make();
export class CreateWhisperDto {
  @IsNotEmpty(message.notEmpty('위스퍼는'))
  @IsString(message.typeIs('위스퍼는', '문자열'))
  content: string;
}
