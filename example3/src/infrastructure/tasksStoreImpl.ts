import { useCallback, useEffect, useState } from 'react';

import { createTask, Task, TasksStore } from '../domain/task';

import {
  addTaskToDB,
  deleteTaskFromDB,
  getTaskFromDB,
  loadTasksFromDB,
  updateTaskOnDB,
} from './database';
import { createTask as createTaskEntity } from './database/models/Task';
import type { Task as TaskEntity } from './database/models/Task';

type UpdaterFn = () => Promise<void>;

const mapEntityToTask = (taskEntity: TaskEntity) => {
  return createTask(taskEntity.description, taskEntity.isCompleted, taskEntity._id);
};

const getEntityId = (task: Task) => task.id;

export function useRealmDBTasksStore(): TasksStore {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateTasks = useCallback(async (updaterFn: UpdaterFn) => {
    setIsUpdating(true);

    await updaterFn();

    const tasksRes = await loadTasksFromDB();
    const newTasks = tasksRes.map(mapEntityToTask);

    setTasks(newTasks);

    setIsUpdating(false);

    return newTasks;
  }, []);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    const tasksRes = await loadTasksFromDB();
    const newTasks = tasksRes.map(mapEntityToTask);

    setTasks(newTasks);

    setIsLoading(false);

    return newTasks;
  }, []);

  const addTask = useCallback(
    (task: Task) =>
      updateTasks(async () => {
        await addTaskToDB(createTaskEntity(task.description));
      }),
    [updateTasks]
  );

  const updateTask = useCallback(
    (task: Task) =>
      updateTasks(async () => {
        const taskToUpdate = await getTaskFromDB(getEntityId(task));
        if (!taskToUpdate) {
          throw new Error(`Cannot update task with ID ${task.id}. Task not found!`);
        }

        await updateTaskOnDB({
          ...taskToUpdate,
          description: task.description,
          isCompleted: task.isComplete,
        });
      }),
    [updateTasks]
  );

  const removeTask = useCallback(
    (task: Task) =>
      updateTasks(async () => {
        const taskToRemove = await getTaskFromDB(getEntityId(task));
        if (!taskToRemove) {
          throw new Error(`Cannot remove task with ID ${task.id}. Task not found!`);
        }

        await deleteTaskFromDB(taskToRemove);
      }),
    [updateTasks]
  );

  useEffect(() => {
    loadTasks();
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
