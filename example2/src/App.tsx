import React from 'react';

import { RealmProvider } from './infrastructure/database';
import { TasksView } from './infrastructure/views/Tasks';

export function App() {
  return (
    <RealmProvider>
      <TasksView />
    </RealmProvider>
  );
}
