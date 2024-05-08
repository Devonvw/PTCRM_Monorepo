import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { MailService } from './mail.service';
import { ReactAdapter } from '@webtre/nestjs-mailer-react-adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          SES: {
            ses: new SES({
              region: config.get('aws.region'),
              credentials: {
                accessKeyId: config.get('aws.accessKeyId'),
                secretAccessKey: config.get('aws.secretAccessKey'),
              },
            }),
            aws: { SendRawEmailCommand },
          },
          //   host: config.get('MAIL_HOST'),
          //   port: config.get('MAIL_PORT'),
          //   secure: false,
          //   ignoreTLS: true,
          //   requireTLS: false,
          //   auth: {
          //     user: config.get('MAIL_USERNAME'),
          //     pass: config.get('MAIL_PASSWORD'),
          //   },
          //   debug: true,
        },
        defaults: {
          from: `"${config.get('mail.fromName')}" <${config.get(
            'mail.fromAddress',
          )}>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new ReactAdapter(),
        },
        // options: {
        //   partials: {
        //     dir: join(__dirname, '/templates/partials'),
        //     options: {
        //       strict: true,
        //     },
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
