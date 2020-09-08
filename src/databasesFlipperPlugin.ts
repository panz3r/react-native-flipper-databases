import type { Flipper } from 'react-native-flipper';

import { DatabasesManager } from './databasesManager';
import {
  getInvalidDatabaseError,
  getInvalidRequestError,
  getSqlExecutionError,
} from './errors';
import type { DatabaseDriver } from './types';
import {
  databaseExecuteSqlResponseToFlipperObject,
  databaseGetTableDataReponseToFlipperObject,
  databaseGetTableInfoResponseToFlipperObject,
  databaseGetTableStructureResponseToFlipperObject,
  databaseListToFlipperArray,
  flipperObjectToExecuteSqlRequest,
  flipperObjectToGetTableDataRequest,
  flipperObjectToGetTableInfoRequest,
  flipperObjectToGetTableStructureRequest,
} from './utils';

const DATABASE_LIST_COMMAND: string = 'databaseList';
const EXECUTE_COMMAND: string = 'execute';
const GET_TABLE_DATA_COMMAND: string = 'getTableData';
const GET_TABLE_INFO_COMMAND: string = 'getTableInfo';
const GET_TABLE_STRUCTURE_COMMAND: string = 'getTableStructure';

export class DatabasesFlipperPlugin implements Flipper.FlipperPlugin {
  private readonly ID: string = 'Databases';

  private readonly databasesManager: DatabasesManager;

  constructor(databaseDrivers: DatabaseDriver[]) {
    this.databasesManager = new DatabasesManager(databaseDrivers);
  }

  getId(): string {
    return this.ID;
  }

  onConnect(connection: Flipper.FlipperConnection): void {
    // Init DatabasesManager on connect
    this.databasesManager.init();
    // Attach command listeners
    this.listenForCommands(connection);
  }

  onDisconnect(): void {
    // Nothing
  }

  runInBackground(): boolean {
    return false;
  }

  private listenForCommands(connection: Flipper.FlipperConnection) {
    connection.receive(DATABASE_LIST_COMMAND, async (_data, responder) => {
      responder.success(
        await databaseListToFlipperArray(
          await this.databasesManager.getDatabases()
        )
      );
    });

    connection.receive(GET_TABLE_STRUCTURE_COMMAND, async (data, responder) => {
      const req = flipperObjectToGetTableStructureRequest(data);

      if (!req) {
        return responder.error(getInvalidRequestError());
      }

      const tableStructure = await this.databasesManager.getTableStructure(
        req.databaseId,
        req.table
      );

      if (!tableStructure) {
        return responder.error(getInvalidDatabaseError());
      }

      responder.success(
        databaseGetTableStructureResponseToFlipperObject(tableStructure)
      );
    });

    connection.receive(GET_TABLE_DATA_COMMAND, async (data, responder) => {
      const req = flipperObjectToGetTableDataRequest(data);

      if (!req) {
        return responder.error(getInvalidRequestError());
      }

      const tableData = await this.databasesManager.getTableData(
        req.databaseId,
        req.table,
        req.order,
        req.reverse,
        req.start,
        req.count
      );

      if (!tableData) {
        return responder.error(getInvalidDatabaseError());
      }

      responder.success(databaseGetTableDataReponseToFlipperObject(tableData));
    });

    connection.receive(GET_TABLE_INFO_COMMAND, async (data, responder) => {
      const req = flipperObjectToGetTableInfoRequest(data);

      if (!req) {
        return responder.error(getInvalidRequestError());
      }

      const tableInfo = await this.databasesManager.getTableInfo(
        req.databaseId,
        req.table
      );

      if (!tableInfo) {
        return responder.error(getInvalidDatabaseError());
      }

      responder.success(databaseGetTableInfoResponseToFlipperObject(tableInfo));
    });

    connection.receive(EXECUTE_COMMAND, async (data, responder) => {
      const executeSqlRequest = flipperObjectToExecuteSqlRequest(data);
      if (!executeSqlRequest) {
        return responder.error(getInvalidRequestError());
      }

      try {
        const executeSqlResponse = await this.databasesManager.executeSql(
          executeSqlRequest.databaseId,
          executeSqlRequest.value
        );

        if (!executeSqlResponse) {
          return responder.error(getInvalidDatabaseError());
        }

        responder.success(
          databaseExecuteSqlResponseToFlipperObject(executeSqlResponse)
        );
      } catch (err) {
        return responder.error(getSqlExecutionError(err));
      }
    });
  }
}
