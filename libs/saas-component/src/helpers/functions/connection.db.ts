import { Connection, createConnection } from 'typeorm';

export const CreatedConnection = async (dbParam: any): Promise<Connection> => {
  return createConnection({
    name: dbParam.name,
    type: dbParam.type,
    host: dbParam.host,
    port: +dbParam.port,
    username: dbParam.username,
    password: dbParam.password,
    database: dbParam.database,
    entities: dbParam.entities,
    schema: dbParam.schema,
    synchronize: true,
    cache: true,
    logging: true,
  });
};
