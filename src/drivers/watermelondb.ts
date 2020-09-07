import { Q } from '@nozbe/watermelondb';
import type { Database } from '@nozbe/watermelondb';

import type {
  DatabaseDescriptor,
  DatabaseDriver,
  DatabaseGetTableDataResponse,
  DatabaseGetTableInfoResponse,
  DatabaseGetTableStructureResponse,
} from '../types';

export class WatermelonDBDriver implements DatabaseDriver {
  private readonly databaseName: string = 'WatermelonDB';

  constructor(private readonly database: Database) {}

  async getDatabases(): Promise<DatabaseDescriptor[]> {
    return [
      {
        name: this.databaseName,
      },
    ];
  }

  async getTableNames(
    _databaseDescriptor: DatabaseDescriptor
  ): Promise<string[]> {
    return Object.keys(this.database?.schema.tables ?? []);
  }

  async getTableStructure(
    _databaseDescriptor: DatabaseDescriptor,
    table: string
  ): Promise<DatabaseGetTableStructureResponse> {
    const { columns } = this.database?.schema.tables[table];

    const columnsDef = Object.keys(columns).map((k) => [
      k,
      columns[k].type,
      columns[k].isIndexed,
      columns[k].isOptional,
    ]);

    return {
      structureColumns: ['name', 'type', 'isIndexed', 'isOptional'],
      structureValues: columnsDef,
      indexesColumns: ['name'],
      indexesValues: Object.keys(columns)
        .filter((k) => columns[k].isIndexed)
        .map((k) => [k]),
    };
  }

  async getTableData(
    _databaseDescriptor: DatabaseDescriptor,
    table: string,
    order: string,
    reverse: boolean,
    start: number,
    count: number
  ): Promise<DatabaseGetTableDataResponse> {
    const { columns } = this.database.schema.tables[table];
    const allColumns = [
      'id', // All tables automatically have a string column id to uniquely identify records.
      ...Object.keys(columns),
      // All tables automatically have special columns for sync purposes
      '_status',
      '_changed',
      'last_modified',
    ];
    const collection = this.database.collections.get(table);

    const totalCount = await collection.query().fetchCount();
    const results = await collection
      .query(
        Q.experimentalSortBy(order ?? 'id', !reverse ? 'asc' : 'desc'),
        Q.experimentalSkip(start),
        Q.experimentalTake(count)
      )
      .fetch();

    return {
      columns: allColumns,
      values: results.map((row) =>
        allColumns.map(
          (colName) =>
            ((row._raw as unknown) as { [key: string]: unknown })[colName]
        )
      ),
      start,
      count: totalCount,
      total: results.length,
    };
  }

  async getTableInfo(
    _databaseDescriptor: DatabaseDescriptor,
    table: string
  ): Promise<DatabaseGetTableInfoResponse> {
    return {
      definition: JSON.stringify(this.database.schema.tables[table], null, 2),
    };
  }
}

export default WatermelonDBDriver;
