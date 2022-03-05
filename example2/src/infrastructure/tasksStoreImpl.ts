import { useCallback, useState } from 'react';
import Realm from 'realm';

import { createTask, Task, TasksStore } from '../domain/task';

import { useRealm } from './database';
import { Task as TaskEntity } from './database/models/Task';

type UpdaterFn = (realm: Realm) => void;

const mapEntityToTask = (task: TaskEntity) =>
  createTask(task.description, task.isComplete, task._id.toHexString());

const getEntityId = (task: Task) => new Realm.BSON.ObjectID(task.id);

export function useRealmDBTasksStore(): TasksStore {
  const realm = useRealm();

  const [tasks, setTasks] = useState(
    realm.objects<TaskEntity>('Task').map(mapEntityToTask)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateTasks = useCallback(
    (updaterFn: UpdaterFn) => {
      setIsUpdating(true);

      updaterFn(realm);

      const tasksRes = realm.objects<TaskEntity>('Task').map(mapEntityToTask);

      setTasks(tasksRes);

      setIsUpdating(false);

      return tasksRes;
    },
    [realm]
  );

  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    const tasksRes = realm.objects<TaskEntity>('Task').map(mapEntityToTask);

    setTasks(tasksRes);

    setIsLoading(false);

    return tasksRes;
  }, [realm]);

  const addTask = useCallback(
    async (task: Task) =>
      updateTasks(realmDB => {
        realmDB.write(() => {
          realmDB.create('Task', TaskEntity.generate(task.description));
        });
      }),
    [updateTasks]
  );

  const updateTask = useCallback(
    async (task: Task) =>
      updateTasks(realmDB => {
        const taskToUpdate = realmDB.objectForPrimaryKey<TaskEntity>(
          'Task',
          getEntityId(task)
        );
        if (!taskToUpdate) {
          throw new Error(`Cannot update task with ID ${task.id}. Task not found!`);
        }

        realmDB.write(() => {
          taskToUpdate.description = task.description;
          taskToUpdate.isComplete = task.isComplete;
        });
      }),
    [updateTasks]
  );

  const removeTask = useCallback(
    async (task: Task) =>
      updateTasks(realmDB => {
        const taskToDelete = realmDB.objectForPrimaryKey('Task', getEntityId(task));
        if (!taskToDelete) {
          throw new Error(`Cannot delete task with ID ${task.id}. Task not found!`);
        }

        realmDB.write(() => {
          realmDB.delete(taskToDelete);
        });
      }),
    [updateTasks]
  );

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
