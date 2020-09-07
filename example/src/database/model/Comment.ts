// model/Post.js
import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class Comment extends Model {
  static table = 'comments';

  @field('body') body?: string;

  @field('post_id') postId?: string;
}

export default Comment;
