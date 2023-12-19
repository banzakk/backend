// import { ArrayElementCount } from '@src/decorators/ArrayElementCount.decorator';
import { ArrayElementCount } from '@src/decorators/ArrayElementCount.decorator';
import { CreateHashTagDto } from '@src/hash-tags/dto/create-hash-tag.dto';
import { ValidationMessage } from '@src/utils';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

const message = ValidationMessage.make();
export class CreateWhisperDto {
  @IsNotEmpty(message.notEmpty('위스퍼는'))
  @IsString(message.typeIs('위스퍼는', '문자열'))
  content: string;

  @IsOptional()
  @MaxLength(10, message.maxIs('해시태그는', 10, true))
  @ArrayElementCount(5, '해시태그는')
  hashTag?: CreateHashTagDto;
}
