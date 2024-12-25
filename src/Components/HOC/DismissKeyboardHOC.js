import React from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {AppStyle} from '../../Config/AppStyling';

const Comp = () => {
  return ({children}) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={AppStyle.root}>
      <>{children}</>
    </TouchableWithoutFeedback>
  );
};

const DismissKeyboard = Comp();

export default DismissKeyboard;
