import React from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar } from 'react-native';

import { useTasksViewModel } from '../../controllers/tasksController';
import { useRealmDBTasksStore } from '../tasksStoreImpl';

import { AddTaskForm } from './components/AddTaskForm';
import { IntroText } from './components/IntroText';
import { TaskList } from './components/TaskList';
import { colors } from './styles/colors';

export function TasksView() {
  const tasksStore = useRealmDBTasksStore();
  const {
    tasks,
    shouldShowSpinner,
    shouldDisableButtons,
    addTask,
    toggleTaskStatus,
    removeTask,
  } = useTasksViewModel(tasksStore);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <AddTaskForm onSubmit={addTask} disabled={shouldDisableButtons} />

          {tasks.length === 0 ? (
            <IntroText />
          ) : (
            <TaskList
              tasks={tasks}
              isLoading={shouldShowSpinner}
              onToggleTaskStatus={toggleTaskStatus}
              onDeleteTask={removeTask}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});
