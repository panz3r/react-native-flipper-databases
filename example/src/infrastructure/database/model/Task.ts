import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Task extends Model {
  static table = 'tasks';

  @field('description') description!: string;

  @field('is_complete') isCompleted!: boolean;
}
