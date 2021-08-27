import { addPlugin } from 'react-native-flipper';

import { DatabasesFlipperPlugin } from './databasesFlipperPlugin';
import { WatermelonDBDriver } from './drivers/watermelondb';
import type { DatabaseDriver } from './types';

export function connectDatabases(databaseDrivers: DatabaseDriver[]) {
  addPlugin(new DatabasesFlipperPlugin(databaseDrivers));
}

export const WatermelonDB = WatermelonDBDriver;
