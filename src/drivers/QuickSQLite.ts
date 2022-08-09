import type { openDatabase, QueryResult } from 'react-native-quick-sqlite';

import type {
  DatabaseDescriptor,
  DatabaseDriver,
  DatabaseExecuteSQLResponse,
  DatabaseGetTableDataResponse,
  DatabaseGetTableInfoResponse,
  DatabaseGetTableStructureResponse,
} from '../types';

type QuickSQLiteDatabaseDescription = DatabaseDescriptor & {
  database: ReturnType<typeof openDatabase>;
};

const doQuery = (database: ReturnType<typeof openDatabase>, query: string) => {
  return new Promise<QueryResult>((resolve, reject) => {
    database.executeSql(
      query,
      [],
      result => resolve(result),
      message => reject(`failed: ${message}`)
    );
  });
};

export class QuickSQLiteStorageDriver implements DatabaseDriver<QuickSQLiteDatabaseDescription> {
  constructor(private readonly databases: QuickSQLiteDatabaseDescription[]) {}

  async getDatabases(): Promise<QuickSQLiteDatabaseDescription[]> {
    return this.databases;
  }

  async getTableNames({ database }: QuickSQLiteDatabaseDescription): Promise<string[]> {
    const result = await doQuery(
      database,
      `SELECT name FROM sqlite_schema WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'`
    );

    if (result.rows) {
      const tables: string[] = [];
      for (let index = 0; index < result.rows.length; index++) {
        tables.push(result.rows.item(index).name);
      }

      return tables;
    }

    return [];
  }

  async getTableStructure(
    { database }: QuickSQLiteDatabaseDescription,
    schema: string
  ): Promise<DatabaseGetTableStructureResponse> {
    const result = await doQuery(database, `PRAGMA table_info(\`${schema}\`)`);

    if (result.rows) {
      const cols: string[][] = [];
      for (let index = 0; index < result.rows.length; index++) {
        const col = result.rows.item(index);
        cols.push([col.name, col.type, Boolean(col.notnull), Boolean(col.pk), col.dflt_value]);
      }

      return {
        structureColumns: ['name', 'type', 'not null', 'primary key', 'default value'],
        structureValues: cols,
        indexesColumns: ['name', 'type'],
        indexesValues: cols.filter(col => col[3]).map(([name, type]) => [name, type]),
      };
    }

    return {
      structureColumns: [],
      structureValues: [],
      indexesColumns: [],
      indexesValues: [],
    };
  }

  async getTableData(
    databaseDescriptor: QuickSQLiteDatabaseDescription,
    schema: string,
    order: string | undefined,
    reverse: boolean,
    start: number,
    count: number
  ): Promise<DatabaseGetTableDataResponse> {
    const { structureValues } = await this.getTableStructure(databaseDescriptor, schema);
    const columns = structureValues.map(([colName]) => colName as string);

    const countResult = await doQuery(
      databaseDescriptor.database,
      `SELECT COUNT(*) as count FROM \`${schema}\``
    );

    if (countResult.rows) {
      const totalCount = countResult.rows.item(0).count;

      const orderCol = order ?? 'rowid';
      const orderSort = reverse ? 'DESC' : 'ASC';

      const result = await doQuery(
        databaseDescriptor.database,
        `SELECT * FROM \`${schema}\` ORDER BY ${orderCol} ${orderSort} LIMIT ${count} OFFSET ${start}`
      );

      if (result.rows) {
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
    }

    return { columns: [], values: [], start: 0, count: 0, total: 0 };
  }

  async getTableInfo(
    { database }: QuickSQLiteDatabaseDescription,
    table: string
  ): Promise<DatabaseGetTableInfoResponse> {
    const result = await doQuery(database, `SELECT sql FROM sqlite_schema WHERE name = "${table}"`);

    if (result.rows) {
      return {
        definition: result.rows.item(0).sql,
      };
    }

    return { definition: '' };
  }

  async executeSql(): Promise<DatabaseExecuteSQLResponse> {
    return Promise.reject('Unsupported method');
  }
}
