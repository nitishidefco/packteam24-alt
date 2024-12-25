import React from 'react';
import {TouchableOpacity} from 'react-native';

const Comp = () => {
  return ({
    children,
    style,
    disabled,
    onPress = () => {},
    onLongPress = () => {},
  }) => (
    <TouchableOpacity
      style={style}
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

const TouchableOpacityComp = Comp();

export default React.memo(TouchableOpacityComp);
