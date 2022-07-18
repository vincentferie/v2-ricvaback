import { MulterLocalDisk } from '@app/saas-component/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { BillOfLadingController } from './bill-of-lading.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        MulterLocalDisk(config, 'bill-of-lading'), // MulterAWS3Cloud
    }),
  ],
  controllers: [BillOfLadingController],
  providers: [],
})
export class BillOfLadingModule {}
