import type { SQLiteDatabase } from 'react-native-sqlite-storage';

import type {
  DatabaseDescriptor,
  DatabaseDriver,
  DatabaseExecuteSQLResponse,
  DatabaseGetTableDataResponse,
  DatabaseGetTableInfoResponse,
  DatabaseGetTableStructureResponse,
} from '../types';

type SQLiteDatabaseDescription = DatabaseDescriptor & {
  database: SQLiteDatabase;
};

export class SQLiteStorageDriver implements DatabaseDriver<SQLiteDatabaseDescription> {
  constructor(private readonly databases: SQLiteDatabaseDescription[]) {}

  async getDatabases(): Promise<SQLiteDatabaseDescription[]> {
    return this.databases;
  }

  async getTableNames({ database }: SQLiteDatabaseDescription): Promise<string[]> {
    const [result] = await database.executeSql(
      `SELECT name FROM sqlite_schema WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'`
    );

    const tables: string[] = [];
    for (let index = 0; index < result.rows.length; index++) {
      tables.push(result.rows.item(index).name);
    }

    return tables;
  }

  async getTableStructure(
    { database }: SQLiteDatabaseDescription,
    schema: string
  ): Promise<DatabaseGetTableStructureResponse> {
    const [result] = await database.executeSql(`PRAGMA table_info(${schema})`);

    const cols: string[][] = [];
    for (let index = 0; index < result.rows.length; index++) {
      const col = result.rows.item(index);
      cols.push([
        col.name,
        col.type,
        Boolean(col.notnull),
        Boolean(col.pk),
        col.dflt_value,
      ]);
    }

    return {
      structureColumns: ['name', 'type', 'not null', 'primary key', 'default value'],
      structureValues: cols,
      indexesColumns: ['name', 'type'],
      indexesValues: cols.filter(col => col[3]).map(([name, type]) => [name, type]),
    };
  }

  async getTableData(
    databaseDescriptor: SQLiteDatabaseDescription,
    schema: string,
    order: string | undefined,
    reverse: boolean,
    start: number,
    count: number
  ): Promise<DatabaseGetTableDataResponse> {
    const { structureValues } = await this.getTableStructure(databaseDescriptor, schema);
    const columns = structureValues.map(([colName]) => colName as string);

    const [countResult] = await databaseDescriptor.database.executeSql(
      `SELECT COUNT(*) as count FROM ${schema}`
    );
    const totalCount = countResult.rows.item(0).count;

    const orderCol = order ?? 'rowid';
    const orderSort = reverse ? 'DESC' : 'ASC';
    const [result] = await databaseDescriptor.database.executeSql(
      `SELECT * FROM ${schema} ORDER BY ${orderCol} ${orderSort} LIMIT ${count} OFFSET ${start}`
    );

    const values: unknown[][] = [];
    for (let index = 0; index < result.rows.length; index++) {
      const row = result.rows.item(index);
      values.push(columns.map(colName => row[colName]));
    }

    return {
      columns,
      values,
      start,
      count: result.rows.length,
      total: totalCount,
    };
  }

  async getTableInfo(
    { database }: SQLiteDatabaseDescription,
    table: string
  ): Promise<DatabaseGetTableInfoResponse> {
    const [result] = await database.executeSql(
      `SELECT sql FROM sqlite_schema WHERE name = '${table}'`
    );

    return {
      definition: result.rows.item(0).sql,
    };
  }

  async executeSql(
    _databaseDescriptor: SQLiteDatabaseDescription,
    _query: string
  ): Promise<DatabaseExecuteSQLResponse> {
    return Promise.reject('Unsupported method');
  }
}
