import type Realm from 'realm';

import type {
  DatabaseDescriptor,
  DatabaseDriver,
  DatabaseExecuteSQLResponse,
  DatabaseGetTableDataResponse,
  DatabaseGetTableInfoResponse,
  DatabaseGetTableStructureResponse,
} from '../types';

export class RealmDriver implements DatabaseDriver {
  constructor(private readonly name: string, private readonly realm: Realm) {}

  async getDatabases(): Promise<DatabaseDescriptor[]> {
    return [
      {
        name: this.name,
      },
    ];
  }

  async getTableNames(_databaseDescriptor: DatabaseDescriptor): Promise<string[]> {
    // Return all models excluding embedded ones
    return this.realm.schema
      .filter(schema => !schema.embedded)
      .map(schema => schema.name);
  }

  async getTableStructure(
    _databaseDescriptor: DatabaseDescriptor,
    schema: string
  ): Promise<DatabaseGetTableStructureResponse> {
    const schemaProps = getSchemaProperties(this.realm, schema);
    const schemaColumns = Object.keys(schemaProps);

    const columnsDef = schemaColumns.map(k => [
      k,
      schemaProps[k].type,
      schemaProps[k].default,
      schemaProps[k].indexed,
      schemaProps[k].optional,
      schemaProps[k].mapTo,
    ]);

    return {
      structureColumns: [
        'name',
        'type',
        'defaultValue',
        'isIndexed',
        'isOptional',
        'mapTo',
      ],
      structureValues: columnsDef,
      indexesColumns: ['name', 'type'],
      indexesValues: schemaColumns
        .filter(k => schemaProps[k].indexed)
        .map(k => [k, schemaProps[k].type]),
    };
  }

  async getTableData(
    _databaseDescriptor: DatabaseDescriptor,
    schema: string,
    order: string | undefined,
    reverse: boolean,
    start: number,
    count: number
  ): Promise<DatabaseGetTableDataResponse> {
    const schemaProperties = getSchemaProperties(this.realm, schema);
    const allColumns = Object.keys(schemaProperties);

    const dataSnapshot = this.realm.objects(schema).snapshot();
    const sorted = order ? dataSnapshot.sorted(order, reverse) : dataSnapshot;
    const data = sorted.slice(start, start + count);

    return {
      columns: allColumns,
      values: data.map(row => {
        const rowJSON = row.toJSON();
        return allColumns.map(colName => getCellValue(rowJSON, colName));
      }),
      start,
      count: data.length,
      total: dataSnapshot.length,
    };
  }

  async getTableInfo(
    _databaseDescriptor: DatabaseDescriptor,
    table: string
  ): Promise<DatabaseGetTableInfoResponse> {
    const tableSchema = this.realm.schema.find(schema => schema.name === table);

    return {
      definition: JSON.stringify(tableSchema, null, 2),
    };
  }

  async executeSql(
    _databaseDescriptor: DatabaseDescriptor,
    _query: string
  ): Promise<DatabaseExecuteSQLResponse> {
    return Promise.reject('Unsupported method');
  }
}

// UTILITY FUNCTIONS

function getSchemaProperties(
  realm: Realm,
  schemaName: string
): Record<string, Realm.ObjectSchemaProperty> {
  return (realm.schema.find(schema => schema.name === schemaName)?.properties ??
    {}) as Record<string, Realm.ObjectSchemaProperty>;
}

export function getCellValue(row: Record<string, unknown>, columnName: string): unknown {
  const cellValue = row[columnName];
  return typeof cellValue === 'object' ? JSON.stringify(cellValue, null, 2) : cellValue;
}
