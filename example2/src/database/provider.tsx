import React, { useEffect, useRef, useState } from 'react';
import Realm from 'realm';

import { realmDBContext } from './context';
import Task from './models/Task';

// Open a local realm file with the schema(s) that are a part of this realm.
const config = {
  schema: [Task.schema],
  // Uncomment the line below to specify that this Realm should be deleted if a migration is needed.
  // (This option is not available on synced realms and is NOT suitable for production when set to true)
  // deleteRealmIfMigrationNeeded: true   // default is false
};

export const RealmProvider: React.FC<{}> = ({ children }) => {
  const [isReady, setReady] = useState(false);

  // We store a reference to our realm using useRef that allows us to access it via
  // realmRef.current for the component's lifetime without causing rerenders if updated.
  const realmRef = useRef<Realm | null>(null);

  useEffect(() => {
    async function openRealm() {
      // Since this is a non-sync realm (there is no "sync" field defined in the "config" object),
      // the realm will be opened synchronously when calling "Realm.open"
      const realm = await Realm.open(config);
      realmRef.current = realm;

      /// FlipperDatabasesPlugin - START

      if (__DEV__) {
        // Import connectDatabases function and required DBDrivers
        const {
          connectDatabases,
          RealmDB,
        } = require('react-native-flipper-databases');

        connectDatabases([
          new RealmDB('Realm', realm), // Pass in realm reference
        ]);
      }

      /// FlipperDatabasesPlugin - END

      setReady(!realm?.isClosed);
    }

    openRealm();

    // Return a cleanup callback to close the realm to prevent memory leaks
    return () => {
      const realm = realmRef.current;
      // If having listeners on the realm itself, also remove them using:
      // realm?.removeAllListeners();
      realm?.close();
      realmRef.current = null;

      setReady(!realm?.isClosed);
    };
  }, []);

  if (!isReady || !realmRef.current) {
    return null;
  }

  return (
    <realmDBContext.Provider value={realmRef}>
      {children}
    </realmDBContext.Provider>
  );
};
