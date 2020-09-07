/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';
import { useCallback } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

declare const global: { HermesInternal: null | {} };

import database from './database';
import type Comment from './database/model/Comment';
import type Post from './database/model/Post';

const App = () => {
  const createRandomPostRecord = useCallback(async () => {
    await database.action(async () => {
      const postsCollection = database.collections.get('posts');

      await postsCollection.create((post: Post) => {
        post.title = 'New post';
        post.body = 'Lorem ipsum...';
        post.isPinned = true;
      });
    });
  }, []);

  const createRandomCommentRecord = useCallback(async () => {
    await database.action(async () => {
      const commentsCollection = database.collections.get('comments');

      await commentsCollection.create((comment: Comment) => {
        comment.body = 'Lorem ipsum...';
      });
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <Header />

          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Open <Text style={styles.highlight}>Flipper</Text> and enable{' '}
                <Text style={styles.highlight}>Databases</Text> plugin from the
                sidebar.
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Add data</Text>
              <Button
                title="Create new Post record"
                onPress={createRandomPostRecord}
              />

              <Button
                title="Create new Comment record"
                onPress={createRandomCommentRecord}
              />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                Inside{' '}
                <Text style={styles.highlight}>
                  Flipper &gt; Databases &gt; Data
                </Text>
                , press the <Text style={styles.highlight}>Refresh</Text>{' '}
                button.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
