import { MulterLocalDisk } from '@app/saas-component/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UnloadingController } from './unloading.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        MulterLocalDisk(config, 'unloading'), // MulterAWS3Cloud
    }),
  ],
  controllers: [UnloadingController],
  providers: [],
})
export class UnloadingModule {}
