import {
  asyncTypeOrmConfig,
  configuration,
  validationSchema,
} from '@app/saas-component/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { moduleApps } from './helpers/imports/tenant.import';
import * as masterEntities from './database/entities-index';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema: validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return asyncTypeOrmConfig(configService, masterEntities);
      },
    }),
    ...moduleApps,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
