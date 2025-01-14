import { StyleSheet } from 'react-native';
import { AppStyle, COLOR, Matrics, typography } from '../../Config/AppStyling';
import colors from '../../Config/AppStyling/colors';
import { moderateVerticalScale } from 'react-native-size-matters';

export const loginStyle = StyleSheet.create({
  forgotPasswordText: {
    color: '#307ecc',
    textAlign: 'right',
    marginTop: 10,
    fontSize: 18,
    textDecorationLine: 'underline'
  },
  forgotPasswordStyle:{
    marginRight:Matrics.ms(70),
  },
  scrollViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#EBF0FA',
  },
  container: theme => {
    return [AppStyle.wrapper, { backgroundColor: theme.backgroundColor }];
  },
  reactLogoContainer: {
    alignItems: 'center',
  },
  wrapper: insetTop => ({
    flex: 1,
    paddingHorizontal: Matrics.ms(20),
    paddingBottom: Matrics.ms(16),
    paddingTop: insetTop,
  }),
  mainBody: theme => {
    return {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#EBF0FA',
      alignContent: 'center',
    };
  },
  loginlogoContainer:{
    marginTop:Matrics.ms(50),
    marginBottom:Matrics.ms(55)
  },
  androidLogoConatiner:{
    marginTop:Matrics.ms(100),
    marginBottom:Matrics.ms(60)
  },
  loginText: {
    fontSize: typography.fontSizes.fs21,
    marginBottom: Matrics.ms(9),
    textAlign: 'center',
    color: "#091242",
    fontFamily: typography.fontFamily.Montserrat.SemiBold
  },
  logo: {
    resizeMode: 'contain',
    height: Matrics.ms(100),
    width: Matrics.ms(300),
  },
  loginText2: {
    fontSize: typography.fontSizes.fs15,
    marginBottom: Matrics.ms(38),
    textAlign: 'center',
    color: '#757575',
    fontFamily: typography.fontFamily.Montserrat.Medium
  },
  SectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Matrics.s(40),
    marginTop: Matrics.ms(50),
    marginHorizontal: Matrics.ms(25),
    margin: Matrics.ms(10),
    borderBottomWidth: 1.5,
    borderBottomColor:'#DEDEDE',
  },
  buttonStyle: {
    position:'relative',
    backgroundColor: '#091242',
    borderWidth: 0,
    color: COLOR.PRIMARY,
    borderColor: COLOR.PRIMARY,
    height: Matrics.ms(49),
    width: Matrics.ms(251),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: Matrics.ms(16),
    marginLeft: Matrics.ms(35),
    marginRight: Matrics.ms(35),
    marginTop: Matrics.s(50),
    shadowColor: '#0A1931',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 14,
    bottom:15
    

  },

  buttonTextStyle: {
    color: colors.WHITE,
    paddingTop: Matrics.ms(15),
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs15,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    fontFamily: typography.fontFamily.Montserrat.Medium,
    paddingLeft: Matrics.ms(15),
    paddingRight: Matrics.ms(15),
    fontSize :typography.fontSizes.fs15,
  },
  registerTextStyle: {
    color: COLOR.GRAY,
    textAlign: 'center',
    fontFamily: typography.fontFamily.RobotoSlab.SemiBold,
    fontSize: typography.fontSizes.fs12,
    alignSelf: 'center',
    padding: Matrics.ms(10),
  },
  joinNowTextStyle: {
    color: COLOR.LIGHT_GRAY,
    fontFamily: typography.fontFamily.RobotoSlab.Regular,
    textAlign: 'center',
    fontSize: typography.fontSizes.fs12,
    alignSelf: 'center',
    padding: Matrics.ms(10),
    marginTop: Matrics.ms(15),
    marginBottom: Matrics.ms(8),
  },
  errorTextStyle: {
    color: 'red',
    fontFamily: typography.fontFamily.RobotoSlab.Regular,
    textAlign: 'center',
    fontSize: typography.fontSizes.fs12,
  },
  reactImageStyle: {
    width: '70%',
    height: Matrics.ms(100),
    resizeMode: 'contain',
    margin: Matrics.ms(20),
  },
  loginInputIconStyle: {
    // tintColor: COLOR.LIGHT_GRAY,
    width: Matrics.ms(22),
    height: Matrics.ms(22),
    resizeMode: 'contain'
  },
  loginContainerImage: {
    alignSelf: 'center',
    width: Matrics.ms(300),
    justifyContent: 'flex-end',
    paddingBottom: Matrics.ms(25),
    alignItems: 'center',
    height: Matrics.ms(300),

  },
  socialIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconStyle: {
    marginHorizontal: Matrics.ms(8),
    width: Matrics.ms(35),
    height: Matrics.ms(35),
    tintColor: COLOR.PRIMARY,
  },
  darkModeButtonStyle: theme => {
    return {
      borderWidth: 0.6,
      borderColor: theme.fontColor,
      width: Matrics.ms(150),
      alignSelf: 'center',
      height: Matrics.ms(35),
      backgroundColor: theme.backgroundCard,
      justifyContent: 'center',
      alignItems: 'center',
    };
  },
  darkModeTextStyle: theme => {
    return {
      fontFamily: typography.fontFamily.RobotoSlab.Regular,
      fontSize: typography.fontSizes.fs12,
      color: theme.color,
      textAlign: 'center',
    };
  },
});

export const registerStyle = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: theme => {
    return [AppStyle.wrapper, { backgroundColor: theme.backgroundColor }];
  },
  reactLogoContainer: {
    alignItems: 'center',
  },
  wrapper: insetTop => ({
    flex: 1,
    paddingHorizontal: Matrics.ms(20),
    paddingBottom: Matrics.ms(16),
    paddingTop: insetTop,
  }),

  mainBody: theme => {
    return {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.backgroundColor,
      alignContent: 'center',
    };
  },
  SectionStyle: theme => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      height: Matrics.ms(45),
      marginTop: Matrics.ms(5),
      marginLeft: Matrics.ms(35),
      marginRight: Matrics.ms(35),
      margin: Matrics.ms(10),
      borderBottomWidth: 1,
      borderBottomColor: COLOR.EXTRA_LIGHT_GRAY,
      paddingHorizontal: Matrics.ms(15),
      borderRadius: Matrics.ms(10),
      backgroundColor: theme.backgroundCard,
    };
  },
  buttonStyle: {
    backgroundColor: COLOR.PRIMARY,
    borderWidth: 0,
    color: COLOR.PRIMARY,
    borderColor: COLOR.PRIMARY,
    height: Matrics.ms(40),
    alignItems: 'center',
    borderRadius: Matrics.ms(30),
    marginLeft: Matrics.ms(35),
    marginRight: Matrics.ms(35),
    marginTop: Matrics.ms(20),
    marginBottom: Matrics.ms(25),
  },
  buttonTextStyle: {
    color: COLOR.WHITE,
    fontFamily: typography.fontFamily.RobotoSlab.SemiBold,
    paddingVertical: Matrics.ms(10),
    fontSize: typography.fontSizes.fs12,
  },
  inputStyle: {
    flex: 1,
    color: COLOR.PRIMARY,
    fontFamily: typography.fontFamily.RobotoSlab.Regular,
    paddingLeft: Matrics.ms(15),
    paddingRight: Matrics.ms(15),
    marginBottom: Matrics.ms(10)
  },
  registerTextStyle: theme => {
    return {
      color: theme.fontColor,
      fontFamily: typography.fontFamily.RobotoSlab.SemiBold,
      textAlign: 'center',
      fontSize: typography.fontSizes.fs12,
      alignSelf: 'center',
      padding: Matrics.ms(10),
    };
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: typography.fontSizes.fs12,
  },
  reactImageStyle: {
    width: '70%',
    height: Matrics.ms(120),
    resizeMode: 'contain',
    margin: Matrics.ms(30),
  },
  loginInputIconStyle: {
    tintColor: COLOR.LIGHT_GRAY,
    width: Matrics.ms(18),
    height: Matrics.ms(18),
  },
});
