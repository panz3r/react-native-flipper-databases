import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
// @ts-ignore openURLInBrowser will open the url in your machine browser. (This isn't currently typed in React Native)
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

import { colors } from '../styles/colors';

export const IntroText: React.FC<{}> = () => (
  <View style={styles.content}>
    <Text style={styles.paragraph}>
      Welcome to the React Native Flipper Databases example app for WatermelonDB
    </Text>
    <Text style={styles.paragraph}>
      Start adding a task using the form at the top of the screen to see how they are created in
      WatermelonDB. You can also toggle the task status or remove it from the list.
    </Text>
    <Text style={styles.paragraph}>Learn more about WatermelonDB at:</Text>
    <Pressable onPress={() => openURLInBrowser('https://nozbe.github.io/WatermelonDB/')}>
      <Text style={[styles.paragraph, styles.link]}>nozbe.github.io/WatermelonDB/</Text>
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
