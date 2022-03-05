// Entity

export interface Task {
  id: string;

  description: string;

  isComplete: boolean;
}

// Model

export function createTask(
  description: Task['description'],
  isComplete: Task['isComplete'] = false,
  id: Task['id'] = ''
): Task {
  return {
    id,
    description,
    isComplete,
  };
}

export function toggleStatus(task: Task): Task {
  return {
    ...task,
    isComplete: !task.isComplete,
  };
}

// Store

export interface TasksStore {
  // State
  tasks: Task[];
  isLoading: boolean;
  isUpdating: boolean;

  // Actions
  loadTasks(): Promise<Task[]>;
  addTask(task: Task): Promise<Task[]>;
  updateTask(task: Task): Promise<Task[]>;
  removeTask(task: Task): Promise<Task[]>;
}
