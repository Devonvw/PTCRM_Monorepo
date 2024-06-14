import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReactAdapter } from '@webtre/nestjs-mailer-react-adapter';
import { MailService } from './mail.service';

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
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
