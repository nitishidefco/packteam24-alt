// --------------- LIBRARIES ---------------
import React, {
  useState,
  createRef,
  useContext,
  useEffect,
  useCallback,
} from 'react';
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
  Linking,
  Button,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {loginStyle as styles} from './styles';
import {FullScreenSpinner} from '../../Components/HOC';
import {useNavigation} from '@react-navigation/native';
import {Matrics, typography} from '../../Config/AppStyling';
import Images from '../../Config/Images';
import {ThemeContext} from '../../Components/Provider/ThemeProvider';
import {useDispatch, useSelector} from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import {useAuthActions, useHomeActions} from '../../Redux/Hooks';
import {Loader} from '../../Components/Common';
import {Popup, Validator, toastMessage} from '../../Helpers';
import {setDeviceInfo} from '../../Redux/Reducers/NetworkSlice';
import DeviceInfo from 'react-native-device-info';
import FlagComponent from '../../Components/Common/FlagComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import {errorToast, success} from '../../Helpers/ToastMessage';

import {
  initializeLanguage,
  setLanguageWithStorage,
} from '../../Redux/Reducers/LanguageProviderSlice';
import {useWorkHistoryActions} from '../../Redux/Hooks/useWorkHistoryActions';
import moment from 'moment-timezone';
import checkDeviceTime from '../../Helpers/TimeValidation';
import Footer from '../../Components/Common/Footer';
import {useTheme} from '../../Context/ThemeContext';
import AppLogo from '../../Components/AppLogo';
const languages = {
  POL: 'pl', // Polish
  GER: 'de', // German
  UK: 'en', // English
  RUS: 'ru', // Russian
  UKA: 'ua', // Ukrainian
  ZH: 'cn', //chinese
};

const Login = ({route}) => {
  // --------------- FUNCTION DECLARATION ---------------
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const privacyPolicyUrl = 'https://eda.workflex360.de/de/datenschutzerklarung';
  const applicationInformatinoUrl =
    'https://eda.workflex360.de/de/technischer-support';
  const {getRealTimeCall, realTime, realTimeLoading} = useWorkHistoryActions();
  const theme = useTheme();
  // --------------- STATE ---------------

  // email & password that was static
  // biuro@mhcode.pl  das4you123

  const isConnected = useSelector(state => state?.Network?.isConnected);
  const {deviceId} = useSelector(state => state?.Network);
  const passwordInputRef = createRef();
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const {state, loginCall, forgotPasswordCall} = useAuthActions();
  const {Auth} = useSelector(state => state);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);

  // --------------- LIFECYCLE ---------------
  useEffect(() => {
    if (loading && Auth.isLoginSuccess === true) {
      setLoading(false);
      const successToast = `${t('Toast.LoginSuccess')}`;
      success(successToast);
      navigation.replace('HomeDrawer');
      setUserEmail(null);
      setUserPassword(null);
    } else if (loading && Auth.isLoginSuccess === false) {
      setLoading(false);
    }
  }, [Auth?.isLoginSuccess]);

  useEffect(() => {
    dispatch(initializeLanguage());
  }, []);

  const handleLanguageChange = async country => {
    const selectedLang = languages[country];
    setActiveLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    dispatch(setLanguageWithStorage(selectedLang));
  };

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
    console.log('Getting real time');

    getRealTimeCall();
  }, []);

  // --------------- METHODS ---------------
  const loginAPI = () => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('email', userEmail);
      formdata.append('password', userPassword);
      formdata.append('device_id', deviceId);
      formdata.append('lang', globalLanguage);
      loginCall(formdata);
    } finally {
      // setLoading(false);
    }
  };
  const forgotPasswordAPI = () => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('email', userEmail);
      forgotPasswordCall(formdata);
    } catch (error) {
      setLoading(false);
    }
  };

  /* --------------------------------- Openurl -------------------------------- */
  const OpenURLText = ({url, children}) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.

      // const supported = await Linking.canOpenURL(url);
      const supported = true;

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.forgotPasswordText}>{children}</Text>
      </TouchableOpacity>
    );
  };
  function validateInputs() {
    if (userEmail === '' || userEmail == null) {
      errorToast(i18n.t('Toast.EnterEmail'));
      return false;
    }
    if (!Validator.validateEmail(userEmail)) {
      errorToast(i18n.t('Toast.ValidEmail'));

      return false;
    }
    if (userPassword === '' || userPassword === null) {
      console.log('validate password');

      errorToast(i18n.t('Toast.EnterPassword'));
      return false;
    }
    return true;
  }

  const onLoginPress = () => {
    console.log('Real Time', realTime);
    if (!isConnected) {
      errorToast(i18n.t('Toast.CheckInternet'));
    } else {
      if (validateInputs('Enter Email')) {
        loginAPI();
      }
    }
  };
  const onForgotPasswordPress = () => {
    if (!isConnected) {
      errorToast('Please check your internet connection');
    } else {
      if (validateInputs('Enter Email')) {
        forgotPasswordAPI();
      }
    }
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
  return (
    <FullScreenSpinner>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        enabled>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom:
              Platform.OS === 'ios' ? Matrics.vs(20) : Matrics.vs(0),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.mainBody(theme),
              keyboardVisible && {marginBottom: 80},
            ]}>
            <View
              style={[
                styles.loginlogoContainer,
                Platform.OS === 'ios' && styles.androidLogoConatiner,
              ]}>
              <AppLogo
                style={{
                  height: Matrics.ms(68),
                  width: Matrics.screenWidth * 0.9,
                }}
              />
              {/* <Image
                source={Images.NEW_APP_LOGO}
                style={{
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  height: Matrics.ms(68),
                  width: Matrics.ms(290),
                }}
              /> */}
            </View>
            <Text style={styles.loginText}>{t('Login.title')}</Text>
            <Text style={styles.loginText2}>{t('Login.subtitle')}</Text>
            <View style={[styles.SectionStyle]}>
              <Text
                style={{
                  position: 'absolute',
                  bottom: Matrics.ms(50),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: '#555555',
                }}>
                {t('Login.email')}
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
                placeholder={t('Login.emailPlaceHolder')}
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
            <View style={styles.SectionStyle}>
              <Text
                style={{
                  position: 'absolute',
                  bottom: Matrics.ms(50),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: '#555555',
                }}>
                {t('Login.password')}
              </Text>

              <Image
                source={Images.PASSWORD}
                resizeMode={'contain'}
                style={styles.loginInputIconStyle}
              />
              <TextInput
                style={styles.inputStyle}
                onChangeText={userPassword => setUserPassword(userPassword)}
                placeholder={t('Login.passwordPlaceHolder')}
                placeholderTextColor={'gray'}
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
                value={userPassword}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.buttonStyle,
                {
                  backgroundColor: theme.PRIMARY,
                },
              ]}
              activeOpacity={0.5}
              onPress={onLoginPress}
              disabled={loading}>
              {loading ? (
                <View
                  style={{
                    height: '100%',
                    width: '30%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color={'white'} />
                </View>
              ) : (
                <Text style={styles.buttonTextStyle}>
                  {t('Login.loginButton')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotPasswordStyle}
              activeOpacity={0.5}
              onPress={() => navigation.replace('ForgotPass')}>
              <Text style={styles.forgotPasswordText}>
                {t('Login.forgotPassword')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotPasswordStyle}
              activeOpacity={0.5}
              onPress={() => navigation.replace('CreateAccount')}>
              <Text style={styles.forgotPasswordText}>
                {/* {t('Login.forgotPassword')} */}
                {t('Login.ca')}
              </Text>
            </TouchableOpacity>
            <Footer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FullScreenSpinner>
  );
};

export default Login;
