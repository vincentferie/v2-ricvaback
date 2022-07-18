import { MulterLocalDisk } from '@app/saas-component/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { BookingController } from './booking.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => MulterLocalDisk(config, 'booking'), // MulterAWS3Cloud
    }),
  ],
  controllers: [BookingController],
  providers: [],
})
export class BookingModule {}
