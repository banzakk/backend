import { ValidationMessage, trimAll } from '@src/utils';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const message = ValidationMessage.make();
export class CreateUserDto {
  @Transform((params) => params.value.trim())
  @IsString(message.typeIs('이름은', '문자열'))
  @IsNotEmpty(message.notEmpty('이름은'))
  @MinLength(2, message.minIs('이름은', 2))
  @MaxLength(10, message.maxIs('이름은', 10))
  name: string;

  @Transform((params) => trimAll(params.value))
  @IsString(message.typeIs('아이디는', '문자열'))
  @IsNotEmpty(message.notEmpty('아이디는'))
  @MinLength(2, message.minIs('아이디는', 2))
  @MaxLength(14, message.maxIs('아이디는', 14))
  @Matches(/^[^#@\$%\^&]*$/, {
    message: '아이디에는 #, @, $, %, ^, & 기호를 사용할 수 없습니다.',
  })
  userCustomId: string;

  @Transform((params) => trimAll(params.value))
  @IsString(message.typeIs('비밀번호는', '문자열'))
  @IsNotEmpty(message.notEmpty('비밀번호는'))
  @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,})/, {
    message:
      '비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자 및 특수 문자를 포함해야 합니다.',
  })
  password: string;

  @Transform((params) => trimAll(params.value))
  @IsString(message.typeIs('이메일은', '문자열'))
  @IsNotEmpty(message.notEmpty('이메일은'))
  @MinLength(2, message.minIs('이메일은', 2))
  @MaxLength(50, message.minIs('이메일은', 50))
  @IsEmail({}, { message: '유효하지 않은 이메일 형식입니다.' })
  email: string;

  @IsOptional()
  @IsArray(message.typeIs('해시태그는', '배열'))
  hashTags?: number[];
}
