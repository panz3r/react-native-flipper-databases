import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
// @ts-ignore openURLInBrowser will open the url in your machine browser. (This isn't currently typed in React Native)
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

import { colors } from '../styles/colors';

export const IntroText: React.FC<{}> = () => (
  <View style={styles.content}>
    <Text style={styles.paragraph}>
      Welcome to the React Native Flipper Databases example app for React Native SQLite
      Storage
    </Text>
    <Text style={styles.paragraph}>
      Start adding a task using the form at the top of the screen to see how they are
      created in React Native SQLite Storage. You can also toggle the task status or
      remove it from the list.
    </Text>
    <Text style={styles.paragraph}>Learn more about React Native SQLite Storage at:</Text>
    <Pressable
      onPress={() =>
        openURLInBrowser('https://github.com/andpor/react-native-sqlite-storage')
      }
    >
      <Text style={[styles.paragraph, styles.link]}>
        github.com/andpor/react-native-sqlite-storage
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  paragraph: {
    marginVertical: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
  },
  link: {
    color: colors.purple,
    fontWeight: 'bold',
  },
});
