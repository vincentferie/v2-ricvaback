import { getOptions } from '@app/saas-component/config/rmq.config';
import {
  msADM,
  msATH,
  msDSH,
  msFIN,
  msOPS,
  msSTC,
  msSUP,
} from '@app/saas-component/helpers/constants';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';

@Global()
@Module({
  providers: [
    {
      provide: msATH,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create(getOptions(msATH, config, {})),
    },
    {
      provide: msADM,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create(getOptions(msADM, config, {})),
    },
    {
      provide: msDSH,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create(getOptions(msDSH, config, {})),
    },
    {
      provide: msSTC,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create(getOptions(msSTC, config, {})),
    },
    {
      provide: msOPS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create(getOptions(msOPS, config, {})),
    },
    {
      provide: msSUP,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create(getOptions(msSUP, config, {})),
    },
    {
      provide: msFIN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ClientProxyFactory.create(getOptions(msFIN, config, {})),
    },
  ],
  exports: [msADM, msATH, msDSH, msOPS, msSTC, msSUP, msFIN],
})
export class RabbitMqModule {}
