import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(PORT);
  app.enableCors({
    origin: '*',
  });
  await app.listen(PORT);
}

bootstrap();
