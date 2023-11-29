import { Injectable } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthInfo } from './types/auth-info';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<AuthInfo> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && user.password) {
      const { email, id, uid } = user;
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return { email, userId: id, userUid: uid };
      }
      return null;
    }
    return null;
  }
}
