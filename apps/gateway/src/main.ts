import { ResponseHttpInterceptor } from '@app/saas-component/helpers/interceptor';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

declare const module: any;
const logger = new Logger('Gateway');

async function bootstrap() {
  // Initialize
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Swagger Definition
  const options = new DocumentBuilder()
    .setTitle(config.get('swaggerTitle'))
    .setDescription(config.get('swaggerDescription'))
    .setVersion(config.get('swaggerVersion'))
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('swaggerUrl'), app, document);

  // the next two lines did the trick
  // app.use(bodyParser.json({ limit: '10mb' }));
  // app.use(bodyParser.raw({ limit: '5mb' }));
  // app.use(
  //   bodyParser.urlencoded({
  //     limit: '10mb',
  //     parameterLimit: 10000,
  //     extended: false,
  //   }),
  // );

  // app.use(timeout('5s'));

  // Env Apps security setting
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: ['POST', 'GET', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // This is for set header of apps like apaches
  app.use(helmet.default());
  app.use(requestIp.mw()); // Get Client IP Address

  // Add App prefix
  app.setGlobalPrefix(config.get('appPrefix'));

  // Set Exception
  app.useGlobalInterceptors(new ResponseHttpInterceptor());

  // Somewhere in your initialization
  await app.listen(config.get<number>('port'), () =>
    logger.verbose(
      `Gateway API is Running in ${config.get('environment')} mode !`,
    ),
  );

  // // Hot Reload
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
