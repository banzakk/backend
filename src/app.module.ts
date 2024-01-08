import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { FollowsModule } from './follows/follows.module';
import { RedisModule } from './redis.module';
import { S3Module } from './s3.module';
import { UserHashTagsModule } from './user-hash-tags/user-hash-tags.module';
import { UsersModule } from './users/users.module';
import { WhispersModule } from './whispers/whispers.module';
import { UserWhisperModule } from './user-whisper/user-whisper.module';
import { UserProfileImagesModule } from './user-profile-images/user-profile-images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    RedisModule,
    S3Module,
    UsersModule,
    AuthModule,
    FollowsModule,
    WhispersModule,
    UserWhisperModule,
    UserHashTagsModule,
    UserProfileImagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}
