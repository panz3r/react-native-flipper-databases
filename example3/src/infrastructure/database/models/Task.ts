export interface Task {
  _id: string;

  _rev: string;

  description: string;

  isCompleted: boolean;
}

export function createTask(description: string) {
  return {
    description,
    isCompleted: false,
  };
}
