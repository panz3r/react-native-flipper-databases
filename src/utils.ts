import type {
  DatabaseDescriptorHolder,
  DatabaseGetTableStructureResponse,
  DatabaseGetTableDataResponse,
  DatabaseGetTableInfoResponse,
} from './types';

type FlipperObject = Record<string, unknown>;

type FlipperArray = FlipperObject[];

export async function databaseListToFlipperArray(
  databaseDescriptorHolderList: IterableIterator<DatabaseDescriptorHolder>
): Promise<FlipperArray> {
  const databases = [];
  for (const databaseDescriptorHolder of databaseDescriptorHolderList) {
    const { databaseDescriptor, databaseDriver, id } = databaseDescriptorHolder;

    const tableNameList: string[] = await databaseDriver.getTableNames(
      databaseDescriptor
    );

    databases.push({
      id,
      name: databaseDescriptor.name,
      tables: tableNameList.sort(),
    });
  }

  return databases;
}

interface GetTableStructureRequest {
  readonly databaseId: number;

  readonly table: string;
}

export function flipperObjectToGetTableStructureRequest(
  params: FlipperObject
): GetTableStructureRequest | null {
  const databaseId: number = params.databaseId as number;
  const table: string = params.table as string;

  if (databaseId <= 0 || !table) {
    return null;
  }

  return {
    databaseId,
    table,
  };
}

export function databaseGetTableStructureResponseToFlipperObject(
  databaseGetTableStructureResponse: DatabaseGetTableStructureResponse
): FlipperObject {
  const structureColumns = databaseGetTableStructureResponse.structureColumns;
  const indexesColumns = databaseGetTableStructureResponse.indexesColumns;

  const structureValues = [];
  for (const row of databaseGetTableStructureResponse.structureValues) {
    const cols = [];
    for (const item of row) {
      cols.push(objectAndTypeToFlipperObject(item));
    }
    structureValues.push(cols);
  }

  const indexesValues = [];
  for (const row of databaseGetTableStructureResponse.indexesValues) {
    const cols = [];
    for (const item of row) {
      cols.push(objectAndTypeToFlipperObject(item));
    }
    indexesValues.push(cols);
  }

  return {
    structureColumns,
    structureValues,
    indexesColumns,
    indexesValues,
  };
}

interface GetTableDataRequest {
  readonly databaseId: number;

  readonly table: string;

  readonly order: string;

  readonly reverse: boolean;

  readonly start: number;

  readonly count: number;
}

export function flipperObjectToGetTableDataRequest(
  params: FlipperObject
): GetTableDataRequest | null {
  const databaseId: number = params.databaseId as number;
  const table: string = params.table as string;
  const reverse: boolean = params.reverse as boolean;
  const order: string = params.order as string;
  const start: number = params.start as number;
  const count: number = params.count as number;

  if (databaseId <= 0 || !table) {
    return null;
  }

  return {
    databaseId,
    table,
    order,
    reverse,
    start,
    count,
  };
}

export function databaseGetTableDataReponseToFlipperObject(
  databaseGetTableDataResponse: DatabaseGetTableDataResponse
): FlipperObject {
  const columns = [...databaseGetTableDataResponse.columns];

  const rows = [];
  for (const row of databaseGetTableDataResponse.values) {
    const rowData = [];
    for (const item of row) {
      rowData.push(objectAndTypeToFlipperObject(item));
    }
    rows.push(rowData);
  }

  return {
    columns,
    values: rows,
    start: databaseGetTableDataResponse.start,
    count: databaseGetTableDataResponse.count,
    total: databaseGetTableDataResponse.total,
  };
}

interface GetTableInfoRequest {
  readonly databaseId: number;

  readonly table: string;
}

export function flipperObjectToGetTableInfoRequest(
  params: FlipperObject
): GetTableInfoRequest | null {
  const databaseId = params.databaseId as number;
  const table = params.table as string;

  if (databaseId <= 0 || !table) {
    return null;
  }

  return {
    databaseId,
    table,
  };
}
export function databaseGetTableInfoResponseToFlipperObject(
  databaseGetTableInfoResponse: DatabaseGetTableInfoResponse
): FlipperObject {
  return {
    definition: databaseGetTableInfoResponse.definition,
  };
}

export function toErrorFlipperObject(
  code: number,
  message: string
): FlipperObject {
  return {
    code,
    message,
  };
}

// PRIVATE

function objectAndTypeToFlipperObject(obj: unknown): FlipperObject {
  if (obj === null || typeof obj === 'undefined') {
    return {
      type: 'null',
    };
  }

  if (typeof obj === 'bigint') {
    return {
      type: 'integer',
      value: obj,
    };
  }

  if (typeof obj === 'number') {
    return {
      type: 'float',
      value: obj,
    };
  }

  if (typeof obj === 'string') {
    return {
      type: 'string',
      value: obj,
    };
  }

  if (typeof obj === 'boolean') {
    return {
      type: 'boolean',
      value: obj,
    };
  }

  throw new Error('type of Object is invalid');
}
