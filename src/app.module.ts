import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { PostsModule } from './posts/posts.module';
import { MemberModule } from './member/member.module';
import { ProjectModule } from './project/project.module';
import { DayModule } from './day/day.module';
import { CommentModule } from './comment/comment.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      url: "localhost:6379",
    }),
    AuthModule,
    BoardModule,
    PostsModule,
    MemberModule,
    ProjectModule,
    DayModule,
    CommentModule,
    MapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
