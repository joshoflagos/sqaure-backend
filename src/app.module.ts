import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { IamModule } from './iam/iam.module';
import { TeamModule } from './team/team.module';
import { OrganizerModule } from './organizer/organizer.module';
import { ProgrammeModule } from './programme/programme.module';
import { ParticipantModule } from './participant/participant.module';
import * as Yup from 'yup';
import { CheckincheckoutTokenModule } from './checkincheckout-token/checkincheckout-token.module';
import { TeamUserModule } from './team-user/team-user.module';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Yup.object({
        TYPEORM_HOST: Yup.string().required(),
        TYPEORM_PORT: Yup.number().default(19797),
        TYPEORM_USERNAME: Yup.string().required(),
        TYPEORM_PASSWORD: Yup.string().required(),
        TYPEORM_DATABASE: Yup.string().required(),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('THROTTLE_TTL'),
        limit: config.get<number>('THROTTLE_LIMIT'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('TYPEORM_HOST'),
        port: config.get<number>('TYPEORM_PORT'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        migrations: ['dist/migrations/**/*.js'],
        subscribers: ['dist/subscriber/**/*.js'],
        cli: {
          migrationsDir: config.get<string>('TYPEORM_MIGRATIONS_DIR'),
          subscribersDir: config.get<string>('TYPEORM_SUBSCRIBERS_DIR'),
        },
      }),
    }),
    IamModule,
    TeamModule,
    OrganizerModule,
    ProgrammeModule,
    ParticipantModule,
    CheckincheckoutTokenModule,
    TeamUserModule,
    ComponentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
