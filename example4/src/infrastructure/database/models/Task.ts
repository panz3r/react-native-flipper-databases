import type { Args } from 'vasern/vasern/src/core/vasern/Document';

export const TaskSchema: Args = {
  name: 'Tasks',
  props: {
    description: 'string',
    completed: 'boolean',
  },
};

export type TaskEntity = {
  id: string;

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
