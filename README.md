# react-native-flipper-databases

> Flipper Databases plugin for React Native

[![license](https://img.shields.io/github/license/panz3r/react-native-flipper-databases.svg)](LICENSE) [![Build & Test](https://github.com/panz3r/react-native-flipper-databases/workflows/Build%20&%20Test/badge.svg)](https://github.com/panz3r/react-native-flipper-databases/actions) [![Github Issues](https://img.shields.io/github/issues/panz3r/react-native-flipper-databases.svg)](https://github.com/panz3r/react-native-flipper-databases/issues)

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

## Usage

For [WatermelonDB](https://nozbe.github.io/WatermelonDB/):

```js
// ...

/// ReactNativeFlipperDatabases - START

if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const {
    connectDatabases,
    WatermelonDB,
  } = require('react-native-flipper-databases');

  connectDatabases([
    new WatermelonDB(database), // Pass in database definition
  ]);
}

/// ReactNativeFlipperDatabases - END

// ...
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with :sparkles: & :heart: by [Mattia Panzeri](https://github.com/panz3r) and [contributors](https://github.com/panz3r/react-native-flipper-databases/graphs/contributors)

If you found this project to be helpful, please consider buying me a coffee.

[![buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoff.ee/4f18nT0Nk)
