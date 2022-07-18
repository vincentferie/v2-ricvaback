import { TableColumnName } from 'aws-sdk/clients/honeycode';
import {
  Table,
  TableIndex,
  TableColumnOptions,
  TableForeignKeyOptions,
  QueryRunner,
} from 'typeorm';

export async function up(
  queryRunner: QueryRunner,
  schema: string,
  tableName: string,
  columns: TableColumnOptions[],
  foreignKeys: TableForeignKeyOptions[],
): Promise<void> {
  await queryRunner.createTable(
    new Table({
      name: tableName,
      columns: columns,
      foreignKeys: foreignKeys,
      schema: schema,
    }),
    true,
    true,
  );
}

export async function down(
  queryRunner: QueryRunner,
  tableName: string,
): Promise<any> {
  await queryRunner.dropTable(tableName, true, true, true);
}

export async function createIndex(
  queryRunner: QueryRunner,
  tableName: string,
  indexName: string,
  columns: TableColumnName[],
): Promise<void> {
  await queryRunner.createIndex(
    tableName,
    new TableIndex({
      name: indexName,
      columnNames: columns,
      isUnique: true,
    }),
  );
  // } catch (err) {
  //   await queryRunner.rollbackTransaction();
  // }
}

export async function dropEnum(
  queryRunner: QueryRunner,
  typeEnum: string,
): Promise<any> {
  await queryRunner.query(`DROP TYPE ${typeEnum};`);
}
