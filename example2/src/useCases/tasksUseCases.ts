import { createTask, toggleStatus, Task, TasksStore } from '../domain/task';

type LoadTasksStore = Pick<TasksStore, 'loadTasks'>;

export const loadTasksUseCase = (store: LoadTasksStore) => store.loadTasks();

type UpdateTasksStore = Pick<
  TasksStore,
  'addTask' | 'updateTask' | 'removeTask'
>;

export const addTaskUseCase = (
  store: UpdateTasksStore,
  description: string
) => {
  store.addTask(createTask(description));
};

export const toggleTaskStatusUseCase = (
  store: UpdateTasksStore,
  task: Task
) => {
  store.updateTask(toggleStatus(task));
};

export const removeTaskUseCase = (store: UpdateTasksStore, task: Task) => {
  store.removeTask(task);
};
