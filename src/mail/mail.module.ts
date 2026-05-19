import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host =
          configService.get<string>('MAILTRAP_HOST') ??
          configService.get<string>('MAIL_HOST');
        const portValue =
          configService.get<string>('MAILTRAP_PORT') ??
          configService.get<string>('MAIL_PORT');
        const user =
          configService.get<string>('MAILTRAP_USER') ??
          configService.get<string>('MAIL_USER');
        const pass =
          configService.get<string>('MAILTRAP_PASS') ??
          configService.get<string>('MAIL_PASS');

        if (!host || !user || !pass) {
          throw new Error(
            'Mail configuration is missing. Set MAIL_HOST/MAIL_PORT/MAIL_USER/MAIL_PASS or MAILTRAP_HOST/MAILTRAP_PORT/MAILTRAP_USER/MAILTRAP_PASS.',
          );
        }

        return {
          transport: {
          host,
          port: Number(portValue ?? 2525),
          secure: false,
          auth: {
            user,
            pass,
          },
          },
          defaults: {
            from:
              configService.get<string>('MAIL_FROM') ??
              'Pharmacy Management <no-reply@pharmacy.local>',
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
