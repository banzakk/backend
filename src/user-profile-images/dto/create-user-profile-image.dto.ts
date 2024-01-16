import { ValidationMessage } from '@src/utils';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

const message = ValidationMessage.make();

export class CreateUserProfileImageDto {
  @Transform((params) => params.value.trim())
  @IsString(message.typeIs('아이디는', '문자열'))
  @IsNotEmpty(message.notEmpty('아이디는'))
  @MinLength(2, message.minIs('아이디는', 2))
  @MaxLength(14, message.maxIs('아이디는', 14))
  userCustomId: string;
}
