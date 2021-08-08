import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import Post from './model/Post'; // ⬅️ You'll import your Models here
import Comment from './model/Comment'; // ⬅️ You'll import your Models here

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // dbName: 'myapp', // optional database name or file system path
  // migrations, // optional migrations
  // jsi: true, // JSI mode
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Post, // ⬅️ You'll add Models to Watermelon here
    Comment,
  ],
});

/// FlipperDatabasesPlugin - START

if (__DEV__) {
  // Import connectDatabases function
  const connectDatabases = require('react-native-flipper-databases').default;

  // Import required DBDrivers
  const WatermelonDBDriver =
    require('react-native-flipper-databases/drivers/watermelondb').default;

  connectDatabases([
    new WatermelonDBDriver(database), // Pass in database definition
  ]);
}

/// FlipperDatabasesPlugin - END

export default database;
