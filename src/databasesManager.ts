import type { DatabaseDescriptorHolder, DatabaseDriver } from './types';

export class DatabasesManager {
  private ddHolderMap = new Map<number, DatabaseDescriptorHolder>();

  constructor(private dbDrivers: DatabaseDriver[]) {}

  init() {
    // Precache databases
    this.preloadDatabases();
  }

  async getDatabases() {
    return this.ddHolderMap.values();
  }

  async getTableStructure(databaseId: number, tableName: string) {
    const databaseDescriptorHolder = this.ddHolderMap.get(databaseId);

    if (!databaseDescriptorHolder) {
      return null;
    }

    return databaseDescriptorHolder.databaseDriver.getTableStructure(
      databaseDescriptorHolder.databaseDescriptor,
      tableName
    );
  }

  async getTableData(
    databaseId: number,
    tableName: string,
    order: string,
    reverse: boolean,
    start: number,
    count: number
  ) {
    const databaseDescriptorHolder = this.ddHolderMap.get(databaseId);

    if (!databaseDescriptorHolder) {
      return null;
    }

    return databaseDescriptorHolder.databaseDriver.getTableData(
      databaseDescriptorHolder.databaseDescriptor,
      tableName,
      order,
      reverse,
      start,
      count
    );
  }

  async getTableInfo(databaseId: number, tableName: string) {
    const databaseDescriptorHolder = this.ddHolderMap.get(databaseId);

    if (!databaseDescriptorHolder) {
      return null;
    }

    return databaseDescriptorHolder.databaseDriver.getTableInfo(
      databaseDescriptorHolder.databaseDescriptor,
      tableName
    );
  }

  private async preloadDatabases() {
    let databaseId: number = 1;

    // Reset cached databases
    this.ddHolderMap.clear();

    // Retrieve all DBs from the provided Drivers
    for (const databaseDriver of this.dbDrivers) {
      const databaseDescriptorList = await databaseDriver.getDatabases();
      for (const databaseDescriptor of databaseDescriptorList) {
        const id = databaseId++;

        const databaseDescriptorHolder = {
          id,
          databaseDriver,
          databaseDescriptor,
        };

        this.ddHolderMap.set(id, databaseDescriptorHolder);
      }
    }
  }
}
