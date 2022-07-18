import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const asyncTypeOrmConfig = async (
  config: ConfigService,
  entities,
): Promise<TypeOrmModuleOptions> => ({
  // name: 'master',
  type: 'postgres',
  host: process.env.RDS_HOSTNAME || config.get<string>('dbHost'),
  port: +process.env.RDS_PORT || config.get<number>('dbPort'),
  username: process.env.RDS_USERNAME || config.get<string>('dbUsername'),
  password: process.env.RDS_PASSWORD || config.get<string>('dbPassword'),
  entityPrefix: process.env.RDS_PREFIX || config.get<string>('dbPrefix'),
  database: process.env.RDS_DB_NAME || config.get<string>('dbName'),
  synchronize: config.get<boolean>('dbSynchronize'),
  dropSchema: false, // ?? config.get<boolean>('dbDropSchema'),
  // entities: [__dirname + '/../settings/*.entity{.js,.ts}'],
  entities: Object.values(entities),
  keepConnectionAlive: config.get<boolean>('dbKeepConnectionAlive'),
  autoLoadEntities: config.get<boolean>('dbAutoLoadEntities'),
  // //maxQueryExecutionTime: ,
  // //schema: '',
  logging: config.get<boolean>('dbLogger'),
});
