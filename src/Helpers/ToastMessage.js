import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {SafeAreaComponent} from '../Components/HOC';
import {COLOR, typography} from '../Config/AppStyling';

export const success = (text1 = '', text2 = '') => {
  Toast.show({
    type: 'success',
    text1: text1,
    text2: text2,
    position: 'top',
    visibilityTime: 4000,
  });
};

export const errorToast = (text1 = '', text2 = '') => {
  Toast.show({
    type: 'error',
    text1: text1,
    text2: text2,
    position: 'top',
    visibilityTime: 4000,
  });
};

// Custom Toast component with better text wrapping
const CustomToast = ({
  leftBorderColor,
  backgroundColor,
  textColor,
  icon,
  text1,
  text2,
}) => (
  <View
    style={[
      STYLE.customToastContainer,
      {
        borderLeftColor: leftBorderColor,
        backgroundColor: backgroundColor || COLOR.WHITE,
      },
    ]}>
    {icon && <View style={STYLE.iconContainer}>{icon}</View>}
    <View style={STYLE.textContainer}>
      {text1 ? (
        <Text style={[STYLE.text1Style, {color: textColor}]} numberOfLines={2}>
          {text1}
        </Text>
      ) : null}

      {text2 ? (
        <Text style={[STYLE.text2Style, {color: textColor}]} numberOfLines={3}>
          {text2}
        </Text>
      ) : null}
    </View>
  </View>
);

export const toastConfig = {
  success: props => (
    <SafeAreaComponent style={STYLE.safeareaView}>
      <CustomToast
        {...props}
        leftBorderColor={COLOR.SUCCESS}
        textColor={COLOR.GREEN}
      />
    </SafeAreaComponent>
  ),
  error: props => (
    <SafeAreaComponent style={STYLE.safeareaView}>
      <CustomToast
        {...props}
        leftBorderColor={COLOR.SECONDARY}
        textColor={COLOR.SECONDARY}
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
    justifyContent: 'center',
    paddingBottom: 0,
  },
  customToastContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  text1Style: {
    fontFamily: typography.fontFamily.Roboto.Regular,
    fontSize: typography.fontSizes.fs15,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  text2Style: {
    fontFamily: typography.fontFamily.Roboto.Regular,
    fontSize: typography.fontSizes.fs14,
    flexWrap: 'wrap',
  },
});
