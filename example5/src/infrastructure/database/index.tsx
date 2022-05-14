import SQLite from 'react-native-sqlite-storage';

import { createTasksTable } from './models/Task';

SQLite.enablePromise(true);

export async function openTasksDatabase() {
  const db = await SQLite.openDatabase({ name: 'tasks.db' });

  // Create tables
  await createTasksTable(db);

  /// ReactNativeFlipperDatabases - START

  if (__DEV__) {
    // Import connectDatabases function and required DBDrivers
    const { connectDatabases, SQLiteStorage } = require('react-native-flipper-databases');
    connectDatabases([
      // Pass in database definitions
      new SQLiteStorage([
        {
          name: 'tasks.db',
          database: db,
        },
      ]),
    ]);
  }

  /// ReactNativeFlipperDatabases - END

  return db;
}
