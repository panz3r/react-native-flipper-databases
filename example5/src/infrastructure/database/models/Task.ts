import type { SQLiteDatabase } from 'react-native-sqlite-storage';

const tableName = 'Tasks';

export type TaskEntity = {
  id: number;

  description: string;

  completed?: boolean;
};

type NewTaskEntity = Omit<TaskEntity, 'id'>;

export function generateTaskEntity(description: string): NewTaskEntity {
  return {
    description,
    completed: false,
  };
}

export async function createTasksTable(db: SQLiteDatabase) {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
      description TEXT NOT NULL,
      completed BOOLEAN
    );`;

  await db.executeSql(query);
}

export async function getTasks(db: SQLiteDatabase): Promise<TaskEntity[]> {
  const tasks: TaskEntity[] = [];

  try {
    const results = await db.executeSql(
      `SELECT rowid as id, description, completed FROM ${tableName}`
    );

    results.forEach(({ rows }) => {
      for (let index = 0; index < rows.length; index++) {
        tasks.push(rows.item(index));
      }
    });
  } catch (err) {
    throw Error('Failed to get Tasks!');
  }

  return tasks;
}

export async function findTask(db: SQLiteDatabase, taskID: number): Promise<TaskEntity> {
  try {
    const results = await db.executeSql(
      `SELECT rowid as id, description, completed FROM ${tableName} WHERE id = ${taskID}`
    );

    return results[0].rows.item(0);
  } catch (err) {
    throw Error('Failed to find Task!');
  }
}

export async function insertTask(db: SQLiteDatabase, newTask: NewTaskEntity): Promise<TaskEntity> {
  const insertQuery = `INSERT INTO ${tableName}(description, completed) values('${newTask.description}', ${newTask.completed})`;

  try {
    const [result] = await db.executeSql(insertQuery);

    return findTask(db, result.insertId);
  } catch (err) {
    throw Error('Failed to insert Task!');
  }
}

export async function replaceTask(db: SQLiteDatabase, task: TaskEntity): Promise<TaskEntity> {
  const updateQuery = `INSERT OR REPLACE INTO ${tableName}(rowid, description, completed) values(${task.id}, '${task.description}', ${task.completed})`;

  try {
    const [result] = await db.executeSql(updateQuery);

    return findTask(db, result.insertId);
  } catch (err) {
    throw Error('Failed to update Task!');
  }
}

export async function deleteTask(db: SQLiteDatabase, taskId: number): Promise<TaskEntity> {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${taskId}`;

  try {
    const taskToDelete = await findTask(db, taskId);

    await db.executeSql(deleteQuery);

    return taskToDelete;
  } catch (err) {
    throw Error('Failed to delete Task!');
  }
}
