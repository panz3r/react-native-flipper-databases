import { useCallback } from 'react';

import type { Task, TasksStore } from '../domain/task';
import {
  addTaskUseCase,
  loadTasksUseCase,
  toggleTaskStatusUseCase,
  removeTaskUseCase,
} from '../useCases/tasksUseCases';

export function useTasksViewModel(store: TasksStore) {
  const getTasks = useCallback(() => {
    loadTasksUseCase(store);
  }, [store]);

  const addTask = useCallback(
    (description: string) => {
      addTaskUseCase(store, description);
    },
    [store]
  );

  const toggleTaskStatus = useCallback(
    (task: Task) => {
      toggleTaskStatusUseCase(store, task);
    },
    [store]
  );

  const removeTask = useCallback(
    (task: Task) => {
      removeTaskUseCase(store, task);
    },
    [store]
  );

  return {
    tasks: store.tasks,
    shouldShowSpinner: store.isLoading,
    shouldDisableButtons: store.isLoading || store.isUpdating,
    getTasks,
    addTask,
    toggleTaskStatus,
    removeTask,
  };
}
