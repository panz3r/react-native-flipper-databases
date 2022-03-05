import { useCallback, useEffect, useState } from 'react';

import { createTask, Task, TasksStore } from '../domain/task';

import { database } from './database';
import type { Task as TaskEntity } from './database/model/Task';

const tasksCollection = database.collections.get<TaskEntity>('tasks');

const mapEntityToTask = (task: TaskEntity) =>
  createTask(task.description, task.isCompleted, task.id);

const getEntityId = (task: Task) => task.id;

const getTasksFromDB = async () => {
  const tasksRes = await tasksCollection.query().fetch();
  return tasksRes.map(mapEntityToTask);
};

type TasksStoreState = Pick<TasksStore, 'tasks' | 'isLoading' | 'isUpdating'>;

export function useWatermelonTasksStore(): TasksStore {
  const [state, setState] = useState<TasksStoreState>({
    tasks: [],
    isLoading: false,
    isUpdating: false,
  });

  const updateTasks = useCallback(async (updaterFn: Function) => {
    setState(prevState => ({
      ...prevState,
      isUpdating: true,
    }));

    await database.write(async () => {
      updaterFn();
    });

    const tasksRes = await getTasksFromDB();

    setState(prevState => ({
      ...prevState,
      tasks: tasksRes,
      isUpdating: false,
    }));

    return tasksRes;
  }, []);

  const loadTasks = useCallback(async () => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
    }));

    const tasksRes = await getTasksFromDB();

    setState(prevState => ({
      ...prevState,
      tasks: tasksRes,
      isLoading: false,
    }));

    return tasksRes;
  }, []);

  const addTask = useCallback(
    async (task: Task) =>
      updateTasks(async () => {
        await tasksCollection.create(newTask => {
          newTask.description = task.description;
          newTask.isCompleted = task.isComplete;
        });
      }),
    [updateTasks]
  );

  const updateTask = useCallback(
    (task: Task) =>
      updateTasks(async () => {
        const taskToUpdate = await tasksCollection.find(getEntityId(task));
        if (!taskToUpdate) {
          throw new Error(
            `Cannot update task with ID ${task.id}. Task not found!`
          );
        }

        taskToUpdate.update(record => {
          record.description = task.description;
          record.isCompleted = task.isComplete;
        });
      }),
    [updateTasks]
  );

  const removeTask = useCallback(
    (task: Task) =>
      updateTasks(async () => {
        const taskToDelete = await tasksCollection.find(getEntityId(task));
        if (!taskToDelete) {
          throw new Error(
            `Cannot delete task with ID ${task.id}. Task not found!`
          );
        }

        taskToDelete.destroyPermanently();
      }),
    [updateTasks]
  );

  // Initial tasks loading
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    ...state,
    loadTasks,
    addTask,
    updateTask,
    removeTask,
  };
}
