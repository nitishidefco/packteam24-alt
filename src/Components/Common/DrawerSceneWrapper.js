import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {useDrawerProgress} from '@react-navigation/drawer';

const DrawerSceneWrapper = ({children}) => {
  const progress = useDrawerProgress();
  const {width, height} = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: interpolate(progress.value, [0, 1], [1, 0.8], 'clamp')},
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, Platform.OS === 'android' ? width * 0.7 : -10],
          'clamp',
        ),
      },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, 30], 'clamp'),
    overflow: 'hidden',
  }));

  return (
    <View style={[styles.container]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
};

export default DrawerSceneWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        elevation: 10,
        shadowColor: 'white',
        shadowOpacity: 0.5,
      },
      ios: {
        shadowColor: 'white',
        shadowOffset: {width: -5, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
    }),
  },
});
