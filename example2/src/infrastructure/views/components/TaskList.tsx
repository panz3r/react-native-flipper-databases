import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import type { Task } from '../../../domain/task';

import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];

  onToggleTaskStatus: (task: Task) => void;

  onDeleteTask: (task: Task) => void;

  isLoading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTaskStatus,
  onDeleteTask,
  isLoading = false,
}) => {
  const renderItem: ListRenderItem<Task> = useCallback(
    ({ item }) => (
      <TaskItem
        {...item}
        onToggleStatus={() => onToggleTaskStatus(item)}
        onDelete={() => onDeleteTask(item)}
      />
    ),
    [onDeleteTask, onToggleTaskStatus]
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={tasks}
        refreshing={isLoading}
        keyExtractor={taskKeyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

const taskKeyExtractor = (task: Task) => task.id;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
