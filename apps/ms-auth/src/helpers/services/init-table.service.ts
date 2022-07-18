import {
  createIndex,
  CreateIndex,
  CreateTable,
  down,
  dropEnum,
  up,
} from '@app/saas-component';
import { Injectable } from '@nestjs/common';
import {
  Connection,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

@Injectable()
export class TenantDatabaseService {
  constructor() {}

  async setup(
    connection: Connection,
    tables: any[],
    tablesIndex: CreateIndex[],
  ) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    const tableLength = tables[0].length + tables[1].length;
    const promises = [];
    const promises_ = [];
    const promises__ = [];
    const promises___ = [];
    const promises____ = [];
    const i = 0,
      b = 0,
      c = 0;

    setTimeout(async () => {
      queryRunner.clearSqlMemory();
      for (const item of tables[0]) {
        promises.push(
          queryRunner.createTable(
            new Table({
              name: item.name,
              columns: item.columns,
              foreignKeys: item.foreignKeys,
              schema: item.schema,
            }),
            true,
            true,
          ),
        );
      }
      await Promise.all(promises);
    }, 500);

    setTimeout(async () => {
      queryRunner.clearSqlMemory();
      for (const key of tables[1]) {
        // clear sqls in memory to avoid removing tables when down queries executed.
        promises_.push(
          queryRunner.createTable(
            new Table({
              name: key.name,
              columns: key.columns,
              schema: key.schema,
            }),
            true,
            true,
          ),
        );
      }
      await Promise.all(promises_);
    }, 60000);

    setTimeout(async () => {
      queryRunner.clearSqlMemory();
      for (const data of tables[0]) {
        if (data.foreignKeys.length > 0) {
          data.foreignKeys.forEach((tem) => {
            promises__.push(
              queryRunner.createForeignKey(
                `${data.schema}.${data.name}`,
                new TableForeignKey(tem),
              ),
            );
          });
        }
      }
      await Promise.all(promises__);

      for (const data of tables[1]) {
        if (data.foreignKeys.length > 0) {
          data.foreignKeys.forEach((tem) => {
            promises___.push(
              queryRunner.createForeignKey(
                `${data.schema}.${data.name}`,
                new TableForeignKey(tem),
              ),
            );
          });
        }
      }
      await Promise.all(promises___);
    }, 180000);

    setTimeout(async () => {
      queryRunner.clearSqlMemory();
      for (const item of tablesIndex) {
        promises___.push(
          queryRunner.createIndex(
            item.name,
            new TableIndex({
              name: item.indexName,
              columnNames: item.columnNames,
              isUnique: true,
            }),
          ),
        );
      }
      await Promise.all(promises____);
    }, 300000);

    // Wait for 5s to return true
    setTimeout(() => {
      return true;
    }, 8000);
  }

  async multipleTables(connection: Connection, tables: CreateTable[]) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    const tableLength = tables.length;
    let i = 0;

    tables.forEach(async (item) => {
      setImmediate(async () => {
        await up(
          queryRunner,
          item.schema,
          item.name,
          item.columns,
          item.foreignKeys,
        );
      });
      i++;
    });
    // Wait for 5s to return true
    setTimeout(async () => {
      if (i == tableLength) {
        await queryRunner.release();
        return true;
      }
    }, i * 500);
  }

  async singleTable(connection: Connection, table: CreateTable) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    await up(
      queryRunner,
      table.schema,
      table.name,
      table.columns,
      table.foreignKeys,
    );
    await queryRunner.release();
    return true;
  }

  async dropTables(connection: Connection, tables: CreateTable[]) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    const tableLength = tables.length;
    let i = 0;

    tables.forEach(async (item) => {
      setImmediate(async () => {
        await down(queryRunner, item.schema);
      });
      i++;
    });
    // Wait for 5s to return true
    setTimeout(async () => {
      if (i == tableLength) {
        await queryRunner.release();
        return true;
      }
    }, i * 500);
  }

  async dropTable(connection: Connection, table: CreateTable) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    await down(queryRunner, table.schema);
    await queryRunner.release();
    return true;
  }

  async indexTables(connection: Connection, indexTables: CreateIndex[]) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    const tableLength = indexTables.length;
    let i = 0;

    indexTables.forEach(async (item) => {
      setImmediate(async () => {
        await createIndex(
          queryRunner,
          item.name,
          item.indexName,
          item.columnNames,
        );
      });
      i++;
    });
    // Wait for 5s to return true
    setTimeout(async () => {
      if (i == tableLength) {
        await queryRunner.release();
        return true;
      }
    }, i * 500);
  }

  async indexTable(connection: Connection, indexTable: CreateIndex) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    await createIndex(
      queryRunner,
      indexTable.name,
      indexTable.indexName,
      indexTable.columnNames,
    );
    await queryRunner.release();
    return true;
  }

  async dropEnums(connection: Connection, typeEnums: string[]) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    const tableLength = typeEnums.length;
    let i = 0;

    typeEnums.forEach(async (item) => {
      setImmediate(async () => {
        await dropEnum(queryRunner, item);
      });
      i++;
    });
    // Wait for 5s to return true
    setTimeout(async () => {
      if (i == tableLength) {
        await queryRunner.release();
        return true;
      }
    }, i * 500);
  }

  async dropEnum(connection: Connection, typeEnum: string) {
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect(); // performs connection

    await dropEnum(queryRunner, typeEnum);
    await queryRunner.release();
    return true;
  }
}
