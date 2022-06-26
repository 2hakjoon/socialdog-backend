import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const devAllowOrigin = [
    'http://121.154.94.120:4000',
    'http://localhost:3000',
  ];
  const prodAllowOrigon = ['https://oursocialdog.com'];

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.NODE_ENV === 'dev' ? devAllowOrigin : prodAllowOrigon,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  await app.listen(+process.env.PORT || 3000);
}
bootstrap();
