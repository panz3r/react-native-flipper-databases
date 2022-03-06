// @ts-ignore
import PouchDB from '@craftzdog/pouchdb-core-react-native';
// @ts-ignore
import HttpPouch from 'pouchdb-adapter-http';
// @ts-ignore
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
// @ts-ignore
import mapreduce from 'pouchdb-mapreduce';
// @ts-ignore
import replication from 'pouchdb-replication';
// @ts-ignore
import SQLite from 'react-native-sqlite-2';

interface PouchDBResult<T> {
  id: string;

  key: string;

  doc: T;
}

export interface PouchDBResults<T> {
  rows: PouchDBResult<T>[];
}

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);

export default PouchDB.plugin(HttpPouch)
  .plugin(replication)
  .plugin(mapreduce)
  .plugin(SQLiteAdapter);
