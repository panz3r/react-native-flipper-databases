import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import { Task } from './model/Task'; // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // dbName: 'myapp', // optional database name or file system path
  // migrations, // optional migrations
  // jsi: true, // JSI mode
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Task, // ⬅️ You'll add Models to Watermelon here
  ],
});

/// FlipperDatabasesPlugin - START

if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const { connectDatabases, WatermelonDB } = require('react-native-flipper-databases');

  connectDatabases([
    new WatermelonDB(database), // Pass in database definition
  ]);
}

/// FlipperDatabasesPlugin - END
