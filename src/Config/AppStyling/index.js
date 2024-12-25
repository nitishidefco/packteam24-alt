import React from 'react';
import {StyleSheet, Text} from 'react-native';
import COLOR from './colors';
import typography from './typography';
import AppStyle from './styles';
import Matrics, {Scale} from './Matrics';

const appliedCommanStyle = () => {
  const oldTextRender = Text.render;
  Text.render = function (...args) {
    const origin = oldTextRender.call(this, ...args);
    const children = origin.props.children;

    if (typeof children === 'object') {
      return React.cloneElement(origin, {
        children: React.cloneElement(children, {
          style: [styles.defaultText, children.props.style],
        }),
      });
    }
    return React.cloneElement(origin, {
      style: [styles.defaultText, origin.props.style],
    });
  };
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: typography.fontFamily.RobotoSlab.Regular,
    letterSpacing: 0.5,
  },
});

export {COLOR, typography, AppStyle, appliedCommanStyle, Matrics, Scale};
