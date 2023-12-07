import { ValidationMessage } from '@src/utils';
import { IsNotEmpty } from 'class-validator';

const message = ValidationMessage.make();
export class CreateWhisperDto {
  @IsNotEmpty(message.notEmpty('위스퍼는'))
  content: string;
}
