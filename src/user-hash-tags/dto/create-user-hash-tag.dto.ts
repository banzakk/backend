import { ArrayElementCount } from '@src/decorators/ArrayElementCount.decorator';
import { ValidationMessage } from '@src/utils';
import { MaxLength } from 'class-validator';

const message = ValidationMessage.make();

export class CreateUserHashTagDto {
  @MaxLength(10, message.maxIs('해시태그는', 10, true))
  @ArrayElementCount(5, '해시태그는')
  hashTags?: string[];
}
