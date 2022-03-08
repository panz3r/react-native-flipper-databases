import type {
  DatabaseDescriptor,
  DatabaseDriver,
  DatabaseExecuteSQLResponse,
  DatabaseGetTableDataResponse,
  DatabaseGetTableInfoResponse,
  DatabaseGetTableStructureResponse,
} from '../types';

type PouchDBDatabaseDescription = DatabaseDescriptor & {
  database: PouchDB;
};

export class PouchDBDriver implements DatabaseDriver<PouchDBDatabaseDescription> {
  constructor(private readonly databases: PouchDB[]) {}

  async getDatabases(): Promise<PouchDBDatabaseDescription[]> {
    return this.databases.map(db => ({
      name: db.name,
      database: db,
    }));
  }

  async getTableNames(databaseDescriptor: PouchDBDatabaseDescription): Promise<string[]> {
    // Return database name as table names
    return [databaseDescriptor.name];
  }

  async getTableStructure(
    _databaseDescriptor: PouchDBDatabaseDescription,
    _schema: string
  ): Promise<DatabaseGetTableStructureResponse> {
    return {
      structureColumns: ['name', 'type'],
      structureValues: [
        ['_id', 'string'],
        ['doc', 'JSON'],
        ['attachments', 'JSON'],
        ['_rev', 'string'],
        ['deleted', 'boolean'],
      ],
      indexesColumns: ['name', 'type'],
      indexesValues: [['_id', 'string']],
    };
  }

  async getTableData(
    databaseDescriptor: PouchDBDatabaseDescription,
    _schema: string,
    order: string | undefined,
    reverse: boolean,
    start: number,
    count: number
  ): Promise<DatabaseGetTableDataResponse> {
    const pouch = databaseDescriptor.database;

    const results = await pouch.allDocs({
      include_docs: true,
      attachments: true,
      skip: start,
      limit: count,
    });

    // Sort results only on _id field
    const sorted =
      order === '_id'
        ? results.rows.sort((a, b) => {
            if (a.id > b.id) {
              return reverse ? -1 : 1;
            } else {
              return reverse ? 1 : -1;
            }
          })
        : results.rows;

    return {
      columns: ['_id', 'doc', 'attachments', '_rev', 'deleted'],
      values: sorted.map(row => [
        row.id,
        JSON.stringify(row.doc),
        JSON.stringify(row.doc?._attachments ?? []),
        row.value.rev,
        row.value?.deleted ?? false,
      ]),
      start,
      count: results.rows.length,
      total: results.total_rows,
    };
  }

  async getTableInfo(
    databaseDescriptor: PouchDBDatabaseDescription,
    _table: string
  ): Promise<DatabaseGetTableInfoResponse> {
    const databaseInfo = await databaseDescriptor.database.info();

    return {
      definition: JSON.stringify(databaseInfo, null, 2),
    };
  }

  async executeSql(
    _databaseDescriptor: PouchDBDatabaseDescription,
    _query: string
  ): Promise<DatabaseExecuteSQLResponse> {
    return Promise.reject('Unsupported method');
  }
}

// IMPORTED TYPES

type DocumentId = string;
type DocumentKey = string;
type RevisionId = string;
type AttachmentData = string;

/**
 * Stub attachments are returned by PouchDB by default (attachments option set to false)
 */
interface StubAttachment {
  /**
   * Mime type of the attachment
   */
  content_type: string;

  /**
   * Database digest of the attachment
   */
  digest: string;

  /**
   * Attachment is a stub
   */
  stub: true;

  /**
   * Length of the attachment
   */
  length: number;
}

/**
 * Full attachments are used to create new attachments or returned when the attachments option
 * is true.
 */
interface FullAttachment {
  /**
   * Mime type of the attachment
   */
  content_type: string;

  /** MD5 hash, starts with "md5-" prefix; populated by PouchDB for new attachments */
  digest?: string | undefined;

  /**
   * {string} if `binary` was `false`
   * {Blob|Buffer} if `binary` was `true`
   */
  data: AttachmentData;
}

type Attachment = StubAttachment | FullAttachment;

interface Attachments {
  [attachmentId: string]: Attachment;
}

interface IdMeta {
  _id: DocumentId;
}

interface RevisionIdMeta {
  _rev: RevisionId;
}

type Document<Content extends {}> = Content & IdMeta;
type ExistingDocument<Content extends {}> = Document<Content> & RevisionIdMeta;

interface AllDocsMeta {
  /** Only present if `conflicts` is `true` */
  _conflicts?: RevisionId[] | undefined;

  _attachments?: Attachments | undefined;
}

/**
 * Extracted from @types/pouchdb
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e68ecd7ff7318bb869749a65ca36bc3036faf9fb/types/pouchdb-core/index.d.ts#L265
 */
interface AllDocsOptions {
  /**
   * Include attachment data for each document.
   *
   * Requires `include_docs` to be `true`.
   *
   * By default, attachments are Base64-encoded.
   * @see binary
   */
  attachments?: boolean | undefined;
  /** Include contents for each document. */
  include_docs?: boolean | undefined;
  /** Maximum number of documents to return. */
  limit?: number | undefined;
  /**
   * Number of documents to skip before returning.
   *
   * Causes poor performance on IndexedDB and LevelDB.
   */
  skip?: number | undefined;
}

/**
 * Extracted from @types/pouchdb
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e68ecd7ff7318bb869749a65ca36bc3036faf9fb/types/pouchdb-core/index.d.ts#L332
 */
interface AllDocsResponse<Content extends {}> {
  /** The `skip` if provided, or in CouchDB the actual offset */
  offset: number;
  total_rows: number;
  update_seq?: number | string | undefined;
  rows: Array<{
    /** Only present if `include_docs` was `true`. */
    doc?: ExistingDocument<Content & AllDocsMeta> | undefined;
    id: DocumentId;
    key: DocumentKey;
    value: {
      rev: RevisionId;
      deleted?: boolean | undefined;
    };
  }>;
}

interface DatabaseInfo {
  /** Name of the database you gave when you called new PouchDB(), and also the unique identifier for the database. */
  db_name: string;

  /** Total number of non-deleted documents in the database. */
  doc_count: number;

  /** Sequence number of the database. It starts at 0 and gets incremented every time a document is added or modified */
  update_seq: number | string;
}

/**
 * Extracted from @types/pouchdb
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e68ecd7ff7318bb869749a65ca36bc3036faf9fb/types/pouchdb-core/index.d.ts#L641
 */
interface PouchDB<Content extends {} = {}> {
  /** The name passed to the PouchDB constructor and unique identifier of the database. */
  name: string;

  /** Fetch all documents matching the given options. */
  allDocs<Model>(options?: AllDocsOptions): Promise<AllDocsResponse<Content & Model>>;

  /** Get database information */
  info(): Promise<DatabaseInfo>;
}
