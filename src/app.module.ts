import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalksModule } from './walks/walks.module';
import * as Joi from 'joi';
import { UserProfile } from './users/entities/users-profile.entity';
import { Walks } from './walks/entities/walks.entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { Verifies } from './mail/entities/verifies.entity';
import { AuthLocal } from './auth/entities/auth-local.entity';
import { AuthKakao } from './auth/entities/auth-kakao.entity';
import { UploadModule } from './upload/upload.module';
import { PostsModule } from './posts/posts.module';
import { Posts } from './posts/entities/posts.entity';
import { Subscribes } from './subscribes/entities/subscribes.entity';
import { SubscribesModule } from './subscribes/subscribes.module';
import { LikesModule } from './likes/likes.module';
import { Likes } from './likes/entities/likes.entity';
import { CommentsModule } from './comments/comments.module';
import { Comments } from './comments/entities/comments.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        SENDGRID_KEY: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        AWS_S3_ACCESS_ID: Joi.string().required(),
        AWS_S3_SECRET_KEY: Joi.string().required(),
        AWS_S3_BUCKET: Joi.string().required(),
        AWS_S3_REGION: Joi.string().required(),
      }),
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.prod.env',
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV === 'dev',
      logging: true,
      entities: [
        UserProfile,
        AuthLocal,
        Walks,
        Verifies,
        AuthKakao,
        Posts,
        Subscribes,
        Likes,
        Comments,
      ],
    }),
    UploadModule.forRoot({
      accessKeyId: process.env.AWS_S3_ACCESS_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      s3Bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
    }),
    AuthModule.forRoot({
      secretKey: process.env.JWT_SECRET_KEY,
      accessTokenExpiresIn: '1d',
      refreshTokenExpiresIn: '14d',
    }),
    UsersModule,
    WalksModule,
    MailModule,
    PostsModule,
    SubscribesModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
