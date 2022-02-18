import React from 'react';

import { RealmProvider } from './database/provider';

import { TasksApp } from './TasksApp';

export function App() {
  return (
    <RealmProvider>
      <TasksApp />
    </RealmProvider>
  );
}
