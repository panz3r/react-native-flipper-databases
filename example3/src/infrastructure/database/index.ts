import type { Task } from './models/Task';
import PouchDB, { PouchDBResults } from './pouchdb';

const db = new PouchDB('db', {
  adapter: 'react-native-sqlite',
});

/// ReactNativeFlipperDatabases - START

if (__DEV__) {
  // Import connectDatabases function and required DBDrivers
  const { connectDatabases, PouchDB: PouchDBDriver } = require('react-native-flipper-databases');

  connectDatabases([
    new PouchDBDriver([db]), // Pass in database definitions
  ]);
}

/// ReactNativeFlipperDatabases - END

export async function loadTasksFromDB(): Promise<Task[]> {
  const res: PouchDBResults<Task> = await db.allDocs({
    include_docs: true,
    attachments: true,
  });
  // console.log('res', res);
  return (res.rows ?? []).map(row => row.doc);
}

type NewTask = Pick<Task, 'description' | 'isCompleted'>;

export async function addTaskToDB(task: NewTask): Promise<Task> {
  const res = await db.post(task);
  return {
    ...task,
    _id: res.id,
    _rev: res.rev,
  };
}

export async function getTaskFromDB(taskID: Task['_id']): Promise<Task> {
  return db.get(taskID);
}

export async function updateTaskOnDB(updatedTask: Task): Promise<Task> {
  const updateRes = await db.put(updatedTask);
  return {
    ...updatedTask,
    _id: updateRes.id,
    _rev: updateRes.rev,
  };
}

export async function deleteTaskFromDB(task: Task) {
  const deleteRes = await db.put({ ...task, _deleted: true });
  return {
    ...task,
    _id: deleteRes.id,
    _rev: deleteRes.rev,
    _deleted: true,
  };
}
