import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import * as process from 'process';

import helmet from 'helmet';
import { TypeormStore } from 'connect-typeorm';
import { SessionEntity } from './domain/session.entity';
import { DataSource } from 'typeorm';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //. Session configuration
  const sessionRepository = app.get(DataSource).getRepository(SessionEntity);

  app.use(
    session({
      //TODO: Get these values from environment variables
      secret: 'riaghuiaelhgiulh#$%^asdfghADRFH',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 604800000 },
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false, // If using MariaDB.
        ttl: 86400,
      }).connect(sessionRepository),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  //. 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // const config = new DocumentBuilder()
  //   .setTitle('PTCRM API')
  //   .setDescription('The PTCRM API')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
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
