import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Comp = () => {
  const insets = useSafeAreaInsets();
  return ({children, style, disable = false}) => (
    <View
      style={[
        {flex: 1},
        !disable && {
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style && style,
      ]}>
      {children}
    </View>
  );
};

const SafeAreaComponent = Comp();

export default SafeAreaComponent;
