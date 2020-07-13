import { HttpExceptionFilter } from './config/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  app.useGlobalFilters(new HttpExceptionFilter('DEV'));

  app.setGlobalPrefix('/api/v1');

  const options = new DocumentBuilder()
    .setTitle('Movie Rental Store')
    .setDescription('Movie Rental API developed using NestJS')
    .setVersion('1.0')
    .addTag('movies')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
