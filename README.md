# react-native-flipper-databases

> Flipper Databases plugin for React Native

[![license](https://img.shields.io/npm/l/react-native-flipper-databases)](LICENSE) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/panz3r/react-native-flipper-databases.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/panz3r/react-native-flipper-databases/context:javascript)

[![NPM version](https://img.shields.io/npm/v/react-native-flipper-databases.svg)](https://npmjs.com/package/react-native-flipper-databases) [![NPM downloads](https://img.shields.io/npm/dm/react-native-flipper-databases.svg)](https://npmjs.com/package/react-native-flipper-databases)

This [React Native](https://reactnative.dev) plugin allows browsing popular React Native databases using [Flipper](https://fbflipper.com) built-in Databases plugin.

![screenshot.jpeg](images/screenshot.jpeg)

## Installation

```sh
yarn add -D react-native-flipper react-native-flipper-databases
```

## Setup

### iOS

No particular setup is required on iOS.

### Android

Since Android already provide a built-in Databases plugin (see official docs [here](https://fbflipper.com/docs/features/databases-plugin) for more details) in order to avoid conflicts with `react-native-flipper-databases` it must be disabled.

Edit `ReactNativeFlipper.java` file under `android/app/src/debug/java/<your-app-package>` like this

```java
...

import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin;
// import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin; // <- Exclude to avoid plugin conflicts
import com.facebook.flipper.plugins.fresco.FrescoFlipperPlugin;
import com.facebook.flipper.plugins.inspector.DescriptorMapping;
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin;
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor;
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin;
import com.facebook.flipper.plugins.react.ReactFlipperPlugin;
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin;
...

  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (FlipperUtils.shouldEnableFlipper(context)) {
      final FlipperClient client = AndroidFlipperClient.getInstance(context);

      client.addPlugin(new InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()));
      client.addPlugin(new ReactFlipperPlugin());
      // client.addPlugin(new DatabasesFlipperPlugin(context)); // <- Exclude to avoid plugin conflicts
      client.addPlugin(new SharedPreferencesFlipperPlugin(context));
      client.addPlugin(CrashReporterPlugin.getInstance());
...
```

See [facebook/flipper#1628](https://github.com/facebook/flipper/issues/1628) for more details.

### Expo

When sticking to a managed [Expo](https://expo.dev/) project, it's impossible to make the necessary modifications to the `ReactNativeFlipper.java` file.

[@liamdawson](https://github.com/liamdawson) wrote a basic plugin to automate those changes, which will ensure Expo prebuild and builds via EAS will disable the integrated Databases plugin on Android.

See [@liamdawson/disable-react-native-flipper-databases-expo-plugin](https://www.npmjs.com/package/@liamdawson/disable-react-native-flipper-databases-expo-plugin) for more info.

## Usage

### [WatermelonDB](https://nozbe.github.io/WatermelonDB/)

#### Compatibility

| WatermelonDB Version | Use Version |
| -------------------- | ----------- |
| >=0.24.0             | 2.x         |
| <0.24.0              | 1.x         |

#### Setup

Attach a WatermelonDB database:

```js
// ...

/// ReactNativeFlipperDatabases - START

if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const { connectDatabases, WatermelonDB } = require('react-native-flipper-databases');

  connectDatabases([
    new WatermelonDB(database), // Pass in database definition
  ]);
}

/// ReactNativeFlipperDatabases - END

// ...
```

### [MongoDB Realm](https://docs.mongodb.com/realm/sdk/react-native/)

#### Setup

Attach an open Realm:

```js
// ...

const realm = await Realm.open(config);

/// FlipperDatabasesPlugin - START

if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const { connectDatabases, RealmDB } = require('react-native-flipper-databases');

  connectDatabases([
    new RealmDB('Realm', realm), // Pass in a realm name and an open realm reference
  ]);
}

/// FlipperDatabasesPlugin - END

// ...
```

### [PouchDB](https://pouchdb.com/)

#### Setup

Attach an open PouchDB database:

```js
// ...

const db = new PouchDB('db', {
  adapter: 'react-native-sqlite',
});

/// ReactNativeFlipperDatabases - START

if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const {
    connectDatabases,
    PouchDB: PouchDBDriver,
  } = require('react-native-flipper-databases');

  connectDatabases([
    new PouchDBDriver([db]), // Pass in database definitions
  ]);
}

/// ReactNativeFlipperDatabases - END

// ...
```

### [Vasern](https://vasern.github.io/)

#### Setup

Attach an open Vasern database:

```js
// ...

export const VasernDB = new Vasern({
  // Vasern config
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

// ...
```

### [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage)

#### Setup

Attach an open SQLite database (with Promise support enabled)

```js
// ...

SQLite.enablePromise(true);

async function openDatabase() {
  const db = await SQLite.openDatabase({ name: 'data.db' });

  // Create tables

  /// ReactNativeFlipperDatabases - START

  if (__DEV__) {
    // Import connectDatabases function and required DBDrivers
    const { connectDatabases, SQLiteStorage } = require('react-native-flipper-databases');
    connectDatabases([
      // Pass in database definitions
      new SQLiteStorage([
        {
          name: 'data.db',
          database: db,
        },
      ]),
    ]);
  }

  /// ReactNativeFlipperDatabases - END

  return db;
}

// ...
```

## Examples

To see how to implement this plugin and test how it works some examples are provided.

To run the examples:

- clone the repo
```sh
git clone https://codeberg.org/panz3r/react-native-flipper-databases.git
```

- bootstrap the project
```sh
yarn bootstrap
```

- launch one of the following scripts from the root folder

  - `example:watermelon` to launch the [`WatermelonDB`](#watermelondb) example app
  - `example:realm` to launch the [`MongoDB Realm`](#mongodb-realm) example app
  - `example:pouch` to launch the [`PouchDB`](#pouchdb) example app
  - `example:vasern` to launch the [`Vasern`](#vasern) example app
  - `example:sqlitestorage` to launch the [`SQLite Storage`](#react-native-sqlite-storage) example app

The plugin integrations are located inside the `src/infrastructure/database` folder of each example app.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with :sparkles: & :heart: by [Mattia Panzeri](https://codeberg.org/panz3r) and [contributors](https://codeberg.org/panz3r/react-native-flipper-databases/activity)
