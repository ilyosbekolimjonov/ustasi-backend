import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

export class MyLogger extends ConsoleLogger {
  private ignoreContexts = [
    'RoutesResolver',
    'RouterExplorer',
    'InstanceLoader',
  ];

  log(message: string, context?: string) {
    if (context && this.ignoreContexts.includes(context)) return;
    super.log(message, context);
  }
}

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   bufferLogs: true,
  // });

  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger(),
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('app');

  app.use('/favicon.ico', (_request: Request, response: Response) => {
    response.status(204).send();
  });
  // app.setGlobalPrefix(appConfig.apiPrefix);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    origin: appConfig.corsOrigins,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ustasi API')
    .setDescription(
      'Ustasi backend with a classic NestJS module structure and secure auth flows.',
    )
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${appConfig.apiPrefix}/docs`, app, document);

  await app.listen(appConfig.port);

  const url = await app.getUrl();

  console.log(`🚀 App running on: ${url}`);
  console.log(`📄 Swagger: ${url}/${appConfig.apiPrefix}/docs`);
}

void bootstrap();
