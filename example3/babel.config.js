const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          'pouchdb-md5': 'react-native-pouchdb-md5',
          'pouchdb-binary-utils': '@craftzdog/pouchdb-binary-utils-react-native',
          [pak.name]: path.join(__dirname, '..', pak.source),
        },
      },
    ],
  ],
};
