import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {useSelector} from 'react-redux';

const {width: screenWidth} = Dimensions.get('window');

const ResetPasswordButton = ({onForgotPasswordPress, Auth}) => {
  console.log('From the button', Auth);

  const {t} = useTranslation();
  const buttonText = t('ForgotPassword.resetButton');

  return (
    <TouchableOpacity
      style={styles.buttonStyle}
      activeOpacity={0.5}
      onPress={onForgotPasswordPress}>
      <Text
        style={styles.buttonTextStyle}
        numberOfLines={2}
        ellipsizeMode="tail">
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: COLOR.PURPLE,
    borderWidth: 0,
    borderColor: COLOR.PRIMARY,
    minWidth: Matrics.s(250), // Minimum width
    maxWidth: Matrics.screenWidth * 0.8, // Max 80% of screen width
    paddingVertical: Matrics.vs(15),
    paddingHorizontal: Matrics.s(20),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: Matrics.ms(16),
    marginLeft: Matrics.ms(35),
    marginRight: Matrics.ms(35),
    marginTop: Matrics.s(10),
    marginBottom: Matrics.s(10),
    shadowColor: '#0A1931',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 14,
  },
  buttonTextStyle: {
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs16,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  loadingContainer: {
    // height: '100%',
    justifyContent: 'center',
  },
});

export default ResetPasswordButton;
