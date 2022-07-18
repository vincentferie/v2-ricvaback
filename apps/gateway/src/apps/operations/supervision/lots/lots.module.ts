import { MulterLocalDisk } from '@app/saas-component/config';
import { getOptions } from '@app/saas-component/config/rmq.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { LotsController } from './lots.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => MulterLocalDisk(config, 'lots'), // MulterAWS3Cloud
    }),
  ],
  controllers: [LotsController],
  providers: [],
})
export class LotsModule {}
