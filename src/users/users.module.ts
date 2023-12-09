import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { UserHashTag } from '@src/models';
import { SocialsModule } from '@src/socials/socials.module';
import { UserSocial } from '@src/user-socials/entities/user-social.entity';
import { UserSocialsModule } from '@src/user-socials/user-socials.module';
import { User } from '@src/users/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserHashTag, UserSocial]),
    forwardRef(() => AuthModule),
    SocialsModule,
    UserSocialsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
