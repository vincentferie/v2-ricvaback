import { MulterLocalDisk } from '@app/saas-component/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentRefController } from './document-reference.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        MulterLocalDisk(config, 'document-ref'), // MulterAWS3Cloud
    }),
  ],
  controllers: [DocumentRefController],
  providers: [],
})
export class DocumentRefModule {}
