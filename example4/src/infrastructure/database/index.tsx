import Vasern from 'vasern';

import { TaskSchema } from './models/Task';

export const VasernDB = new Vasern({
  schemas: [TaskSchema],
  version: 1,
});
