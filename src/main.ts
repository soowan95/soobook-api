import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as dotenv from 'dotenv';
import { JwtGuard } from './common/guards/jwt.guard';
import { RoleGuard } from './common/guards/role.guard';

dotenv.config({ path: `.env.${process.env.NODE_ENV || `dev`}` });

async function bootstrap() {
  let loggerLevel: LogLevel[] = ['error', 'warn'];
  if (process.env.NODE_ENV === 'dev') {
    loggerLevel = ['error', 'warn', 'log', 'debug', 'verbose'];
  }

  const app = await NestFactory.create(AppModule, {
    logger: loggerLevel,
  });
  const reflector: Reflector = new Reflector();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalGuards(new JwtGuard(reflector), new RoleGuard(reflector));

  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  });

  if (process.env.NODE_ENV === 'dev') {
    const config = new DocumentBuilder()
      .setTitle(`Soobook API Documentation`)
      .setDescription(`Soobook API description`)
      .setVersion('1.0-SNAPSHOT')
      .addTag('- Account', 'Account API Documentation')
      .addTag('- Auth', 'Authentication API Documentation')
      .addTag('- Category', 'Category API Documentation')
      .addTag('- Recurrence', 'Recurrence API Documentation')
      .addTag('- Transaction', 'Transaction API Documentation')
      .addTag('- User', 'User API Documentation')
      .addTag('- User Setting', 'User Setting API Documentation')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, documentFactory);
  }

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
