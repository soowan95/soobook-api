import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector: Reflector = new Reflector();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.useGlobalInterceptors(
    new ResponseInterceptor(reflector),
  );

  if (process.env.NODE_ENV === 'dev') {
    const config = new DocumentBuilder()
      .setTitle(`Soobook API Documentation`)
      .setDescription(`Soobook API description`)
      .setVersion('1.0-SNAPSHOT')
      .addTag('- User', 'User API Documentation')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
