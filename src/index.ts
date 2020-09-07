import { addPlugin } from 'react-native-flipper';

import { DatabasesFlipperPlugin } from './databasesFlipperPlugin';
import type { DatabaseDriver } from './types';

export default function connectDatabases(databaseDrivers: DatabaseDriver[]) {
  addPlugin(new DatabasesFlipperPlugin(databaseDrivers));
}
