import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import type Realm from 'realm';

import IntroText from './components/IntroText';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { useRealm } from './database/hooks';
import Task from './database/models/Task';
import colors from './styles/colors';

function App() {
  // The tasks will be set once the realm has opened and the collection has been queried.
  const [tasks, setTasks] = useState<Realm.Results<Task> | []>([]);

  const { realmRef, isReady } = useRealm();

  useEffect(() => {
    if (!realmRef.current || !isReady) {
      return;
    }

    const realm = realmRef.current;

    // When querying a realm to find objects (e.g. realm.objects('Tasks')) the result we get back
    // and the objects in it are "live" and will always reflect the latest state.
    const tasksResults: Realm.Results<Task> = realm.objects('Task');
    if (tasksResults?.length) {
      setTasks(tasksResults);
    }

    // Live queries and objects emit notifications when something has changed that we can listen for.
    tasksResults.addListener((/*collection, changes*/) => {
      // If wanting to handle deletions, insertions, and modifications differently you can access them through
      // the two arguments. (Always handle them in the following order: deletions, insertions, modifications)
      // If using collection listener (1st arg is the collection):
      // e.g. changes.insertions.forEach((index) => console.log('Inserted item: ', collection[index]));
      // If using object listener (1st arg is the object):
      // e.g. changes.changedProperties.forEach((prop) => console.log(`${prop} changed to ${object[prop]}`));

      // By querying the objects again, we get a new reference to the Result and triggers
      // a rerender by React. Setting the tasks to either 'tasks' or 'collection' (from the
      // argument) will not trigger a rerender since it is the same reference
      setTasks(realm.objects('Task'));
    });

    return () => {
      tasksResults?.removeAllListeners();

      setTasks([]);
    };
  }, [isReady, realmRef]);

  const handleAddTask = useCallback(
    (description: string): void => {
      if (!description) {
        return;
      }

      // Everything in the function passed to "realm.write" is a transaction and will
      // hence succeed or fail together. A transcation is the smallest unit of transfer
      // in Realm so we want to be mindful of how much we put into one single transaction
      // and split them up if appropriate (more commonly seen server side). Since clients
      // may occasionally be online during short time spans we want to increase the probability
      // of sync participants to successfully sync everything in the transaction, otherwise
      // no changes propagate and the transaction needs to start over when connectivity allows.
      const realm = realmRef.current;
      realm?.write(() => {
        realm?.create('Task', Task.generate(description));
      });
    },
    [realmRef]
  );

  const handleToggleTaskStatus = useCallback(
    (task: Task): void => {
      const realm = realmRef.current;
      realm?.write(() => {
        // Normally when updating a record in a NoSQL or SQL database, we have to type
        // a statement that will later be interpreted and used as instructions for how
        // to update the record. But in RealmDB, the objects are "live" because they are
        // actually referencing the object's location in memory on the device (memory mapping).
        // So rather than typing a statement, we modify the object directly by changing
        // the property values. If the changes adhere to the schema, Realm will accept
        // this new version of the object and wherever this object is being referenced
        // locally will also see the changes "live".
        task.isComplete = !task.isComplete;
      });

      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      // realm?.write(() => {
      //   const task = realm?.objectForPrimaryKey('Task', id); // If the ID is passed as an ObjectId
      //   const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
      //   task.isComplete = !task.isComplete;
      // });
    },
    [realmRef]
  );

  const handleDeleteTask = useCallback(
    (task: Task): void => {
      const realm = realmRef.current;
      realm?.write(() => {
        realm?.delete(task);

        // Alternatively if passing the ID as the argument to handleDeleteTask:
        // realm?.delete(realm?.objectForPrimaryKey('Task', id));
      });
    },
    [realmRef]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <AddTaskForm onSubmit={handleAddTask} />
        {tasks.length === 0 ? (
          <IntroText />
        ) : (
          <TaskList
            tasks={tasks}
            onToggleTaskStatus={handleToggleTaskStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </View>
    </SafeAreaView>
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

export default App;
