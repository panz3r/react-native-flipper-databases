import type Vasern from 'vasern';

import type {
  DatabaseDescriptor,
  DatabaseDriver,
  DatabaseExecuteSQLResponse,
  DatabaseGetTableDataResponse,
  DatabaseGetTableInfoResponse,
  DatabaseGetTableStructureResponse,
} from '../types';

export class VasernDriver implements DatabaseDriver {
  private readonly databaseName: string = 'Vasern';

  constructor(private readonly database: Vasern) {}

  async getDatabases(): Promise<DatabaseDescriptor[]> {
    return [
      {
        name: this.databaseName,
      },
    ];
  }

  async getTableNames(_databaseDescriptor: DatabaseDescriptor): Promise<string[]> {
    return this.database.docs.map(doc => doc.name);
  }

  async getTableStructure(
    _databaseDescriptor: DatabaseDescriptor,
    table: string
  ): Promise<DatabaseGetTableStructureResponse> {
    const { props: columns } = this.database.get(table);

    const columnsDef = Object.keys(columns).map(k => [
      k,
      (columns as unknown as Record<string, string>)[k].replaceAll('?', ''),
      (columns as unknown as Record<string, string>)[k].startsWith('?'),
    ]);

    return {
      structureColumns: ['name', 'type', 'isOptional'],
      structureValues: [['id', 'string', false]].concat(columnsDef),
      indexesColumns: ['name'],
      indexesValues: [['id']],
    };
  }

  async getTableData(
    _databaseDescriptor: DatabaseDescriptor,
    table: string,
    order: string | undefined,
    reverse: boolean,
    start: number,
    _count: number
  ): Promise<DatabaseGetTableDataResponse> {
    const { props: columns } = this.database.get(table);

    const allColumns = [
      'id', // All tables automatically have a string column id to uniquely identify records.
      ...Object.keys(columns),
    ];
    const collection = this.database.get(table);

    const totalCount = collection.count();
    const results = collection.order(order ?? 'id', !reverse ? 'asc' : 'desc').data();

    return {
      columns: allColumns,
      values: results.map(row =>
        allColumns.map(colName => (row as unknown as { [key: string]: unknown })[colName])
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
    const { props } = this.database.get(table);
    return {
      definition: JSON.stringify(props, null, 2),
    };
  }

  async executeSql(
    _databaseDescriptor: DatabaseDescriptor,
    _query: string
  ): Promise<DatabaseExecuteSQLResponse> {
    return Promise.reject('Unsupported method');
  }
}
