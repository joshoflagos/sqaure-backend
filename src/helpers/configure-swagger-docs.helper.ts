import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';

const SWAGGER_ENVS = ['local', 'dev', 'staging'];

export function configureSwaggerDocs(
  app: INestApplication,
  configService: ConfigService,
) {
  if (SWAGGER_ENVS.includes(configService.get<string>('NODE_ENV'))) {
    app.use(
      ['/docs', '/docs-json', '/docs-yaml'],
      basicAuth({
        challenge: true,
        users: {
          [configService.get<string>('SWAGGER_USER')]:
            configService.get<string>('SWAGGER_PASSWORD'),
        },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Audstack API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth')
      .addTag('users')
      .addTag('delivery')
      .addTag('parcelshop')
      .addTag('parcelshopowner')
      .addTag('fc')
      .addTag('carowner-users')
      .addTag('store-branch')
      .addTag('home')
      .addTag('store-dispatcher')
      .addTag('store-delivery')
      .addTag('continent')
      .addTag('country')
      .addTag('state')
      .addTag('lga')
      .addTag('ward')
      .addTag('account')
      .addTag('local-courier-fee')
      .addTag('state-courier-fee')
      .addTag('country-courier-fee')
      .addTag('global-courier-fee')
      .addTag('job')
      .addTag('staff')
      .addTag('store-contact')
      .addTag('place')
      .addTag('address')
      .addTag('staff')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);
  }
}
