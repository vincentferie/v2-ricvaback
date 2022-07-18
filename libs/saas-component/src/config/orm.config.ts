import { join } from 'path';

module.exports = {
  type: 'postgres',
  host: 'ns3126579.ip-178-33-239.eu',
  port: 5432,
  username: 'ricva_master',
  password: 'KIao7!&&-)^*Kajhsk',
  database: 'ricva_master',
  entities: [
    join(__dirname, '../apps/ms-auth/src/apps/**/**/**/*.entity{.ts,.js}'),
    join(__dirname, '../apps/ms-auth/src/apps/**/**/*.entity{.ts,.js}'),
    join(__dirname, '../apps/ms-auth/src/apps/**/*.entity{.ts,.js}'),
  ],
  autoLoadEntities: true,
  logging: false,
  synchronize: false,
};
