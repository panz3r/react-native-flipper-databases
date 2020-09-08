// BASE types

export type FlipperObject = Record<string, unknown>;

export type FlipperArray = FlipperObject[];

// REQUEST types

export interface GetTableStructureRequest {
  readonly databaseId: number;

  readonly table: string;
}

export interface GetTableDataRequest {
  readonly databaseId: number;

  readonly table: string;

  readonly order: string;

  readonly reverse: boolean;

  readonly start: number;

  readonly count: number;
}

export interface GetTableInfoRequest {
  readonly databaseId: number;

  readonly table: string;
}

export interface ExecuteSqlRequest {
  readonly databaseId: number;

  readonly value: string;
}

// RESPONSE types

export interface DatabaseGetTableStructureResponse {
  readonly structureColumns: string[];

  readonly structureValues: unknown[][];

  readonly indexesColumns: string[];

  readonly indexesValues: unknown[][];
}

export interface DatabaseGetTableDataResponse {
  readonly columns: string[];

  readonly values: unknown[][];

  readonly start: number;

  readonly count: number;

  readonly total: number;
}

export interface DatabaseGetTableInfoResponse {
  readonly definition: string;
}

export type ExecuteSQLType = 'select' | 'insert' | 'update_delete' | 'raw';

export interface DatabaseExecuteSQLResponse {
  readonly type: ExecuteSQLType;

  readonly columns: string[] | null;

  readonly values: unknown[][] | null;

  readonly insertedId: number | null;

  readonly affectedCount: number | null;
}

// DATABASE types

export interface DatabaseDescriptor {
  name: string;
}

export interface DatabaseDriver<
  DD extends DatabaseDescriptor = DatabaseDescriptor
> {
  getDatabases(): Promise<DD[]>;

  getTableNames(databaseDescriptor: DD): Promise<string[]>;

  getTableStructure(
    databaseDescriptor: DD,
    table: string
  ): Promise<DatabaseGetTableStructureResponse>;

  getTableData(
    databaseDescriptor: DD,
    table: string,
    order: string,
    reverse: boolean,
    start: number,
    count: number
  ): Promise<DatabaseGetTableDataResponse>;

  getTableInfo(
    databaseDescriptor: DD,
    table: string
  ): Promise<DatabaseGetTableInfoResponse>;

  executeSql(
    databaseDescriptor: DD,
    query: string
  ): Promise<DatabaseExecuteSQLResponse>;
}

export interface DatabaseDescriptorHolder {
  readonly id: number;

  readonly databaseDriver: DatabaseDriver;

  readonly databaseDescriptor: DatabaseDescriptor;
}
