import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';

import { TypeormStore } from 'connect-typeorm';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { SessionEntity } from './domain/session.entity';
import { RolesGuard } from './guards/roles.guard';
import { GlobalExceptionsFilter } from './utils/global-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //. Session configuration
  const sessionRepository = app.get(DataSource).getRepository(SessionEntity);

  app.use(
    session({
      secret: 'riaghuiaelhgiulh#$%^asdfghADRFH',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 604800000 },
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        ttl: 86400,
      }).connect(sessionRepository),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      /\.vercel\.app$/,
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  const config = new DocumentBuilder()
    .setTitle('PTCRM API')
    .setDescription('The PTCRM API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}

bootstrap();
