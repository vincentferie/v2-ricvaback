import { msSUP } from '@app/saas-component';
import { getOptions } from '@app/saas-component/config/rmq.config';
import { TimeoutInterceptor } from '@app/saas-component/helpers/interceptor/timeout.interceptor';
// import { TimeoutInterceptor } from '@app/saas-component/helpers/interceptor/timeout.interceptor';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

// declare const module: any;
const logger = new Logger('Supervision');
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    getOptions(msSUP, null, {}),
  );

  // Set Exception
  app.useGlobalInterceptors(new TimeoutInterceptor());

  await app.listen().then(() => {
    logger.verbose('Supervision-engine microservice is up and running!');
  });

  // Hot Reload
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
