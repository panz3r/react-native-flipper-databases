// model/Post.js
import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class Post extends Model {
  static table = 'posts';

  @field('title') title?: string;

  @field('subtitle') subtitle?: string;

  @field('body') body?: string;

  @field('is_pinned') isPinned?: boolean;
}

export default Post;
