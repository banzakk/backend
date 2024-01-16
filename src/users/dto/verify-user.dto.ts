import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class VerifyUserIdDto extends PickType(CreateUserDto, [
  'userCustomId',
] as const) {}

export class VerifyUserEmailDto extends PickType(CreateUserDto, [
  'email',
] as const) {}
