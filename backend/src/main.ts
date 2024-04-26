import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import * as passport from 'passport';
import * as process from 'process';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  //. Session configuration
  app.use(
    session({
      //TODO: Get these values from environment variables
      secret: "riaghuiaelhgiulh#$%^asdfghADRFH",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    })
  )
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());

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
