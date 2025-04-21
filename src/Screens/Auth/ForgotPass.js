// --------------- LIBRARIES ---------------
import React, {useState, createRef, useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Text,
  TextInput,
  ImageBackground,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {loginStyle as styles} from './styles';
import {FullScreenSpinner} from '../../Components/HOC';
import {useNavigation} from '@react-navigation/native';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import Images from '../../Config/Images';
import {ThemeContext} from '../../Components/Provider/ThemeProvider';
import {useDispatch, useSelector} from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import {useAuthActions, useHomeActions} from '../../Redux/Hooks';
import {Loader} from '../../Components/Common';
import {Popup, Validator, toastMessage} from '../../Helpers';
import {setDeviceInfo} from '../../Redux/Reducers/NetworkSlice';
import DeviceInfo from 'react-native-device-info';
import useSavedLanguage from '../../Components/Hooks/useSavedLanguage';
import {errorToast, success} from '../../Helpers/ToastMessage';
import Footer from '../../Components/Common/Footer';
import ResetPasswordButton from '../../Components/Common/ForgotPasswordButton';
const ForgotPass = () => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  // --------------- STATE ---------------

  // email & password that was static
  // biuro@mhcode.pl  das4you123
  const isConnected = useSelector(state => state?.Network?.isConnected);

  const {dark, theme, toggle} = useContext(ThemeContext);
  const {deviceId, manufacturer} = useSelector(state => state?.Network);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [dropdownAlert, setDropdownAlert] = useState(null);
  const {state, loginCall, forgotPasswordCall} = useAuthActions();
  const {Auth} = useSelector(state => state);
  /* ------------------------ Custom hook for language ------------------------ */
  const language = useSavedLanguage();
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  // --------------- LIFECYCLE ---------------
  // useEffect(() => {
  //   if (loading && Auth.isForgotPasswordSuccess === true) {
  //     setLoading(false);
  //     // const successToast = `${t('Toast.LoginSuccess')}`;
  //     // success(successToast);
  //     // navigation.navigate('HomeDrawerStack', {screen: 'HomeDrawer'});
  //     setUserEmail(null);
  //     // setUserPassword(null);
  //   } else if (loading && Auth.isForgotPasswordSuccess === false) {
  //     setLoading(false);
  //     errorToast(i18n.t('Toast.LoginUnsuccessful'));
  //   }
  // }, [Auth?.isForgotPasswordSuccess]);
  // ---------------Getting Device info---------------
  useEffect(() => {
    const getDeviceInfo = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      const manufacturer = await DeviceInfo.getManufacturer();
      dispatch(
        setDeviceInfo({
          deviceId: deviceId,
          manufacturer: manufacturer,
        }),
      );
    };
    getDeviceInfo();
  }, []);
  // --------------- METHODS ---------------

  const forgotPasswordAPI = () => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('email', userEmail);
      formdata.append('lang', globalLanguage);
      forgotPasswordCall(formdata);
    } catch (error) {
      // setLoading(false);
    }
  };

  const onForgotPasswordPress = () => {
    if (!isConnected) {
      errorToast(i18n.t('Toast.CheckInternet'));
      return;
    }

    if (!userEmail) {
      errorToast(t('ResetPassword.emptyEmailValidation'));
      return;
    }

    if (!Validator.validateEmail(userEmail)) {
      errorToast(t('ResetPassword.invalidEmail'));
      return;
    }

    forgotPasswordAPI();
  };
  const hideStatusBar = () => {
    StatusBar.setHidden(true);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const containerWidth =
    t('ForgotPassword.resetButton').length > 31
      ? Matrics.mvs(320)
      : Matrics.s(250);
  const fontSize =
    t('ForgotPassword.resetButton').length > 31
      ? typography.fontSizes.fs14
      : typography.fontSizes.fs15;
  const longTextHeight =
    t('ForgotPassword.resetButton').length > 38
      ? Matrics.vs(60)
      : Matrics.vs(50);

  return (
    <FullScreenSpinner>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        enabled>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              inLineStyles.mainBody(theme),
              keyboardVisible && {marginBottom: 80},
            ]}>
            <View
              style={[
                styles.loginlogoContainer,
                Platform.OS === 'ios' && styles.androidLogoConatiner,
              ]}>
              <Image
                source={Images.NEW_APP_LOGO}
                style={{
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  height: Matrics.ms(68),
                  width: Matrics.ms(290),
                }}
              />
            </View>
            <Text style={styles.loginText}>{t('ForgotPassword.title')}</Text>
            <Text style={inLineStyles.loginText2}>
              {t('ForgotPassword.subtitle')}
            </Text>
            <View style={[styles.SectionStyle]}>
              <Text
                style={{
                  position: 'absolute',
                  bottom: Matrics.ms(50),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: '#555555',
                }}>
                {t('ForgotPassword.email')}
              </Text>
              <Image
                source={Images.EMAIL}
                resizeMode={'center'}
                style={styles.loginInputIconStyle}
              />
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                value={userEmail}
                placeholder={t('ForgotPassword.emailPlaceHolder')}
                placeholderTextColor={'gray'}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <ResetPasswordButton
              onForgotPasswordPress={onForgotPasswordPress}
            />
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={inLineStyles.goBack}>
                {t('ForgotPassword.backToLogin')}
              </Text>
            </TouchableOpacity>
            <Footer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FullScreenSpinner>
  );
};

const inLineStyles = StyleSheet.create({
  goBack: {
    color: '#307ecc',
    textAlign: 'center',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  loginText2: {
    fontSize: typography.fontSizes.fs15,
    marginBottom: Matrics.ms(38),
    marginHorizontal: Matrics.ms(5),
    textAlign: 'center',
    color: '#757575',
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  mainBody: theme => {
    return {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#EBF0FA',
      alignContent: 'center',
    };
  },
  mainBodyContainer: {
    // marginHorizontal: Matrics.ms(2),
  },
});

export default ForgotPass;
