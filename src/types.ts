export interface DatabaseDescriptor {
  name: string;
}

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
}

export interface DatabaseDescriptorHolder {
  readonly id: number;

  readonly databaseDriver: DatabaseDriver;

  readonly databaseDescriptor: DatabaseDescriptor;
}
