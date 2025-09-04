import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as dotenv from 'dotenv';
import { JwtAccessGuard } from './common/guards/jwt-access.guard';
import {JwtRefreshGuard} from "./common/guards/jwt-refresh.guard";

dotenv.config({ path: `.env.${process.env.NODE_ENV || `dev`}` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector: Reflector = new Reflector();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.useGlobalGuards(
    new JwtAccessGuard(reflector),
    new JwtRefreshGuard(reflector),
  )

  app.useGlobalInterceptors(
    new ResponseInterceptor(reflector),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  })

  if (process.env.NODE_ENV === 'dev') {
    const config = new DocumentBuilder()
      .setTitle(`Soobook API Documentation`)
      .setDescription(`Soobook API description`)
      .setVersion('1.0-SNAPSHOT')
      .addTag('- Auth', 'Authentication API Documentation')
      .addTag('- User', 'User API Documentation')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
