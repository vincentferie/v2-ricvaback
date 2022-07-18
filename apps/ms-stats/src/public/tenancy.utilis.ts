import { Connection, getConnectionManager, createConnection } from 'typeorm';
import * as baseOrm from '@app/saas-component/config/orm.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { isDefined } from 'class-validator';
import { Entities } from '../helpers/imports/entities.import';

export async function getTenantConnection(
  tenant: string,
  dbConfig: any,
): Promise<Connection> {
  const connectionName = `${tenant.split('-')[0].toLocaleLowerCase()}`;
  const connectionManager = getConnectionManager();

  if (connectionManager.has(connectionName)) {
    const connection = connectionManager.get(connectionName);
    return Promise.resolve(
      connection.isConnected ? connection : connection.connect(),
    );
  } else {
    // Set tenancy Orm config
    const tenantOrmConfig = {
      name: connectionName,
      type: dbConfig.type,
      host: dbConfig.host,
      port: +dbConfig.port,
      username: 'ricva_master',
      password: 'KIao7!&&-)^*Kajhsk',
      database: dbConfig.basename.toLowerCase(),
      schema: 'cashew',
      entities: Entities,
    };
    // Try to connecte immediatly on name
    const connect = connectionManager.get();

    // If Connection if not possible or does not exist create new connection with database results
    const dbExist = await connect.query(
      `SELECT datname FROM pg_database WHERE datname='${tenantOrmConfig.database}';`,
    );

    if (isDefined(dbExist) && dbExist.length > 0) {
      // await connection.close(); // Close connection
      return createConnection({
        ...(baseOrm as PostgresConnectionOptions),
        ...(tenantOrmConfig as PostgresConnectionOptions),
      });
    } else {
      // If there is error again, check the error exception
      //if (errLevelTwo.code === '28P01' && errLevelTwo.routine === 'auth_failed') { // For authentification it is meaning that database or user does not exists
      // Get role/user
      const getDbRole = await connect.query(
        `SELECT rolname FROM pg_roles WHERE rolname='ricva_master';`,
      );
      // Create database
      const createDB =
        isDefined(getDbRole) && getDbRole.length > 0
          ? await connect.query(
              `CREATE DATABASE ${tenantOrmConfig.database} WITH OWNER=${getDbRole[0].rolname} ENCODING='UTF8' ALLOW_CONNECTIONS=true LC_COLLATE='fr_FR.UTF-8' LC_CTYPE='fr_FR.UTF-8' CONNECTION LIMIT=-1;`,
            )
          : null;
      // Make sure that database has all privileges of his tenant user
      const grantPrivileges =
        isDefined(createDB) && getDbRole.length > 0
          ? await connect.query(
              `GRANT ALL PRIVILEGES ON DATABASE ${tenantOrmConfig.database} TO ${getDbRole[0].rolname};`,
            )
          : null;

      // Create Extension
      if (isDefined(grantPrivileges)) {
        // If Role and Database was created else try new connection
        const updateParams: any = { ...tenantOrmConfig };
        delete updateParams.schema;
        // updateParams.name = 'anonymes';
        // Connection
        const firstConnection: Connection = await createConnection({
          ...(baseOrm as PostgresConnectionOptions),
          ...(tenantOrmConfig as PostgresConnectionOptions),
        });

        //set on this database the schema
        const createSchema = await firstConnection.query(
          `CREATE SCHEMA IF NOT EXISTS ${tenantOrmConfig.schema};`,
        );
        //set on this database the schema
        await firstConnection.query(`CREATE SCHEMA IF NOT EXISTS public;`);
        //set on this database the uuid extension
        const createExtention = await firstConnection.query(
          `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
        );

        // await connection.close(); // Close connection

        if (isDefined(createSchema) && isDefined(createExtention)) {
          return firstConnection;
        }
      }
    }
  }
}
