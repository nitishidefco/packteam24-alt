// --------------- LIBRARIES ---------------
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
// --------------- ASSETS ---------------

// --------------- COMPONENT ---------------
export const MyFastImage = ({
  style,
  defaultSource,
  source,
  children,
  resizeMode,
  // onLoad,
  imageStyle,
}) => {
  return (
    <View style={[{overflow: 'hidden'}, style]}>
      <FastImage
        style={imageStyle}
        source={{
          uri: source ?? 'https://',
          priority: FastImage.priority.normal,
        }}
        resizeMode={
          resizeMode == 'contain'
            ? FastImage.resizeMode.contain
            : FastImage.resizeMode.cover
        }
        defaultSource={defaultSource}>
        {children}
      </FastImage>
    </View>
  );
};
