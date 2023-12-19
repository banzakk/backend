import { ValidationMessage } from '@src/utils';
import { ArrayMaxSize, MaxLength, MinLength } from 'class-validator';

const message = ValidationMessage.make();
export class CreateHashTagDto {
  @MinLength(2, message.minIs('해시태그는', 2, true))
  @MaxLength(10, message.maxIs('해시태그는', 10, true))
  @ArrayMaxSize(5, message.arrayMaxIs('해시태그는', 5))
  hashTag: string;
}
