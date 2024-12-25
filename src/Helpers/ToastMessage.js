import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { SafeAreaComponent } from '../Components/HOC';
import { COLOR, Matrics, typography } from '../Config/AppStyling';
import { Constants } from '../Config';

export const success = (
  text1 = '',
  text2 = '',
  messageType = Constants.TOASTTYPE.SUCCESS,
) => {
  Toast.show({
    type: 'tomatoToast',
    text1: text1,
    text2: text2,
    props: {
      messageType: messageType,
    },
  });
};

export const info = (
  text1 = '',
  text2 = '',
  messageType = Constants.TOASTTYPE.INFO,
) => {
  Toast.show({
    type: 'tomatoToast',
    text1: text1,
    text2: text2,
    props: {
      messageType: messageType,
    },
  });
};

export const error = (
  text1 = '',
  text2 = '',
  messageType = Constants.TOASTTYPE.ERROR,
) => {
  Toast.show({
    type: 'tomatoToast',
    text1: text1,
    text2: text2,
    props: {
      messageType: messageType,
    },
  });
};

export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: COLOR.PURPLE }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: COLOR.PRIMARY,
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: typography.fontSizes.fs15,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  tomatoToast: ({ text1, text2, props }) => {
    const messageType = props.messageType;
    return (
      <SafeAreaComponent
        style={[
          STYLE.safeareaView,
          {
            backgroundColor:
              messageType === Constants.TOASTTYPE.SUCCESS
                ? COLOR.SUCCESSTOAST
                : messageType === Constants.TOASTTYPE.INFO
                ? COLOR.INFO
                : COLOR.TOMATO,
          },
        ]}>
        <View style={Platform.OS === 'ios' ? STYLE.root2 : STYLE.root}>
          <Text
            style={[
              STYLE.text1,
              {
                color:
                  messageType === Constants.TOASTTYPE.INFO
                    ? COLOR.PURPLE
                    : COLOR.WHITE,
                fontSize: typography.fontSizes.fs15,
                fontFamily: typography.fontFamily.Montserrat.Regular,
                fontWeight : '600'
              },
            ]}
          >
            {text1}
          </Text>
          {text2 !== '' && (
            <Text
              style={[
                STYLE.text1,
                {
                  color:
                    messageType === Constants.TOASTTYPE.INFO
                      ? COLOR.PURPLE
                      : COLOR.WHITE,
                },
              ]}
            >
              {text2}
            </Text>
          )}
        </View>
      </SafeAreaComponent>
    );
  },
};

export default {
  success,
  info,
  error,
};

const STYLE = StyleSheet.create({
  safeareaView: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.WHITE,
    justifyContent: 'center',
    paddingBottom: 0,
  },
  root: {
    paddingBottom: Matrics.ms(5),
    paddingTop: Matrics.ms(10),
    paddingHorizontal: Matrics.ms(10),
  },
  root2: {
    paddingBottom: Matrics.ms(5),
    paddingTop: Matrics.ms(5),
    paddingHorizontal: Matrics.ms(10),
  },
  text1: {
    fontFamily: typography.fontFamily.RobotoSlab.Regular,
    fontSize: typography.fontSizes.fs11,
    lineHeight: Matrics.ms(18),
    letterSpacing: 0.6,
    color: COLOR.PURPLE,
  },
});
