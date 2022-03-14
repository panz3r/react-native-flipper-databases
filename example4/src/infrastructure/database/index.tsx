import Vasern from 'vasern';

import { TaskSchema } from './models/Task';

export const VasernDB = new Vasern({
  schemas: [TaskSchema],
  version: 1,
});

/// ReactNativeFlipperDatabases - START

if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const {
    connectDatabases,
    VasernDB: VasernDBDriver,
  } = require('react-native-flipper-databases');

  connectDatabases([
    new VasernDBDriver(VasernDB), // Pass in database definitions
  ]);
}

/// ReactNativeFlipperDatabases - END
