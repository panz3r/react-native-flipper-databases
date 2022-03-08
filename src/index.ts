import { addPlugin } from 'react-native-flipper';

import { DatabasesFlipperPlugin } from './databasesFlipperPlugin';
import { PouchDBDriver } from './drivers/pouchdb';
import { RealmDriver } from './drivers/realm';
import { WatermelonDBDriver } from './drivers/watermelondb';
import type { DatabaseDriver } from './types';

export function connectDatabases(databaseDrivers: DatabaseDriver[]) {
  addPlugin(new DatabasesFlipperPlugin(databaseDrivers));
}

export const WatermelonDB = WatermelonDBDriver;

export const RealmDB = RealmDriver;

export const PouchDB = PouchDBDriver;
