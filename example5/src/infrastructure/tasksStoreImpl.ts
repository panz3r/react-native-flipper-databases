import { useCallback, useEffect, useState } from 'react';
import type { SQLiteDatabase } from 'react-native-sqlite-storage';

import { createTask, Task, TasksStore } from '../domain/task';

import { openTasksDatabase } from './database';
import {
  deleteTask,
  generateTaskEntity,
  getTasks,
  insertTask,
  replaceTask,
  TaskEntity,
} from './database/models/Task';

let tasksDB: SQLiteDatabase | null = null;

const getTasksFromDB = async () => {
  if (!tasksDB) {
    return [];
  }

  const tasks = await getTasks(tasksDB);

  return tasks.map(mapEntityToTask);
};

const mapEntityToTask = (task: TaskEntity): Task =>
  createTask(task.description, task.completed, `${task.id}`);

const mapTaskToEntity = (task: Task): TaskEntity => ({
  id: parseInt(task.id, 10),
  description: task.description,
  completed: task.isComplete,
});

const getEntityId = (task: Task): number => parseInt(task.id, 10);

export function useSQLiteStorageTasksStore(): TasksStore {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    const tasksRes = await getTasksFromDB();

    setTasks(tasksRes);

    setIsLoading(false);

    return tasksRes;
  }, []);

  const addTask = useCallback(async (task: Task) => {
    let updatedTasks: Task[] = [];

    if (!tasksDB) {
      return updatedTasks;
    }

    setIsUpdating(true);

    const newTaskEntity = generateTaskEntity(task.description);
    const newTask = await insertTask(tasksDB, newTaskEntity);

    setTasks(prevTasks => {
      updatedTasks = prevTasks.concat(mapEntityToTask(newTask));
      return updatedTasks;
    });

    setIsUpdating(false);
    return updatedTasks;
  }, []);

  const updateTask = useCallback(async (task: Task) => {
    let updatedTasks: Task[] = [];

    if (!tasksDB) {
      return updatedTasks;
    }

    setIsUpdating(true);

    const updatedTaskEntity = await replaceTask(tasksDB, mapTaskToEntity(task));
    const updatedTask = mapEntityToTask(updatedTaskEntity);

    if (updatedTask) {
      setTasks(prevTasks => {
        updatedTasks = prevTasks.map(prevTask =>
          prevTask.id === updatedTask.id ? updatedTask : prevTask
        );
        return updatedTasks;
      });
    }

    setIsUpdating(false);
    return updatedTasks;
  }, []);

  const removeTask = useCallback(async (task: Task) => {
    let updatedTasks: Task[] = [];

    if (!tasksDB) {
      return updatedTasks;
    }

    setIsUpdating(true);

    await deleteTask(tasksDB, getEntityId(task));

    setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));

    setIsUpdating(false);
    return updatedTasks;
  }, []);

  useEffect(() => {
    const openDB = async () => {
      tasksDB = await openTasksDatabase();

      await loadTasks();
    };

    openDB();

    return () => {
      tasksDB?.close();
    };
  }, [loadTasks]);

  return {
    tasks,
    isLoading,
    isUpdating,
    loadTasks,
    addTask,
    updateTask,
    removeTask,
  };
}
