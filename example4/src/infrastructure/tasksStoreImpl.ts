import { useCallback, useEffect, useState } from 'react';

import { createTask, Task, TasksStore } from '../domain/task';

import { VasernDB } from './database';
import { generateTaskEntity, TaskEntity } from './database/models/Task';

const tasksDB = VasernDB.get('Tasks');

const getTasksFromDB = () => (tasksDB.data() as TaskEntity[]).map(mapEntityToTask);

const mapEntityToTask = (task: TaskEntity): Task =>
  createTask(task.description, task.completed, task.id);

const getEntityId = (task: Task): string => task.id;

export function useVasernTasksStore(): TasksStore {
  const [tasks, setTasks] = useState<Task[]>(getTasksFromDB());
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);

    const tasksRes = getTasksFromDB();

    setTasks(tasksRes);

    setIsLoading(false);

    return tasksRes;
  }, []);

  const addTask = useCallback(async (task: Task) => {
    let updatedTasks: Task[] = [];
    setIsUpdating(true);

    const newTaskEntity = generateTaskEntity(task.description);
    const newTask = tasksDB.insert(newTaskEntity) as false | TaskEntity[];

    if (newTask) {
      setTasks(prevTasks => {
        updatedTasks = prevTasks.concat(mapEntityToTask(newTask[0]));
        return updatedTasks;
      });
    }

    setIsUpdating(false);
    return updatedTasks;
  }, []);

  const updateTask = useCallback(async (task: Task) => {
    let updatedTasks: Task[] = [];

    setIsUpdating(true);

    tasksDB.perform(db => {
      const taskToUpdate = db.get(getEntityId(task));
      if (!taskToUpdate) {
        throw new Error(`Cannot update task with ID ${task.id}. Task not found!`);
      }

      const updatedTask = db.update(getEntityId(task), {
        // @ts-ignore
        description: task.description,
        completed: task.isComplete,
      }) as false | TaskEntity;

      if (updatedTask) {
        setTasks(prevTasks => {
          updatedTasks = prevTasks.map(prevTask =>
            prevTask.id === updatedTask.id ? mapEntityToTask(updatedTask) : prevTask
          );
          return updatedTasks;
        });
      }
    });

    setIsUpdating(false);
    return updatedTasks;
  }, []);

  const removeTask = useCallback(async (task: Task) => {
    let updatedTasks: Task[] = [];

    setIsUpdating(true);

    tasksDB.perform(db => {
      const taskToDelete = db.get(getEntityId(task));
      if (!taskToDelete) {
        throw new Error(`Cannot delete task with ID ${task.id}. Task not found!`);
      }

      const removed = db.remove(getEntityId(task));
      if (removed) {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
      }
    });

    setIsUpdating(false);
    return updatedTasks;
  }, []);

  useEffect(() => {
    /**
     * onLoaded is used to rehydrate the data from the Stored Instance.
     * Without this method already stored data would not be able to access.
     * Having this in the Mount method is going to be better so that other methods in the components doesn't have to use onLoaded.
     */
    tasksDB.onLoaded(loadTasks);

    /**
     * onChange is used to perform actions whenever DB is changed or updated.
     */
    tasksDB.onChange(loadTasks);
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
