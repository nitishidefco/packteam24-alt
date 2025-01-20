import React from 'react';
import {StyleSheet} from 'react-native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {SafeAreaComponent} from '../Components/HOC';
import {COLOR, typography} from '../Config/AppStyling';

export const success = (text1 = '', text2 = '') => {
  Toast.show({
    type: 'success',
    text1: text1,
    text2: text2,
  });
};

export const errorToast = (text1 = '', text2 = '') => {
  console.log(text1, 'text 1');

  Toast.show({
    type: 'error',
    text1: text1,
    text2: text2,
  });
};

export const toastConfig = {
  success: props => (
    <SafeAreaComponent style={STYLE.safeareaView}>
      <BaseToast
        {...props}
        style={[{borderLeftColor: COLOR.SUCCESS}, STYLE.toastContainer]}
        contentContainerStyle={{paddingHorizontal: 10}}
        text1Style={{
          fontFamily: typography.fontFamily.Roboto.Regular,
          fontSize: typography.fontSizes.fs15,
          color: COLOR.GREEN,
        }}
      />
    </SafeAreaComponent>
  ),
  error: props => (
    <SafeAreaComponent style={STYLE.safeareaView}>
      <ErrorToast
        {...props}
        style={[{borderLeftColor: COLOR.SECONDARY}, STYLE.toastContainer]}
        text1Style={{
          fontSize: typography.fontSizes.fs15,
          fontFamily: typography.fontFamily.Roboto.Regular,
          color: COLOR.SECONDARY,
        }}
        text2Style={{
          fontSize: typography.fontSizes.fs15,
          fontFamily: typography.fontFamily.Roboto.Regular,
          color: COLOR.SECONDARY,
        }}
      />
    </SafeAreaComponent>
  ),
};

export default {
  success,
  errorToast,
};

const STYLE = StyleSheet.create({
  safeareaView: {
    width: '100%',
    // backgroundColor: COLOR.WHITE,
    justifyContent: 'center',
    paddingBottom: 0,
  },
  toastContainer: {
    width: '95%',
    alignSelf: 'center',
  },
});
