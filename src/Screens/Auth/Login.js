// --------------- LIBRARIES ---------------
import React, {useState, createRef, useContext, useEffect} from 'react';
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
const languages = {
  UK: 'en', // English
  GER: 'de', // German
  POL: 'pl', // Polish
  RUS: 'ru', // Russian
  UKA: 'uk', // Ukrainian
};
const Login = ({route}) => {
  // --------------- FUNCTION DECLARATION ---------------
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  // --------------- STATE ---------------

  // email & password that was static
  // biuro@mhcode.pl  das4you123

  const {dark, theme, toggle} = useContext(ThemeContext);
  const isConnected = useSelector(state => state?.Network?.isConnected);
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
  const [activeLanguage, setActiveLanguage] = useState(null);
  // --------------- LIFECYCLE ---------------
  useEffect(() => {
    if (loading && Auth.isLoginSuccess === true) {
      setLoading(false);
      toastMessage.success('Login successful');
      navigation.navigate('HomeDrawer');
      setUserEmail(null);
      setUserPassword(null);
    } else if (loading && Auth.isLoginSuccess === false) {
      setLoading(false);
      toastMessage.error('Login Unsuccessful');
    }
  }, [Auth?.isLoginSuccess]);

  useEffect(() => {
    const setDefaultLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('language');
        if (savedLang) {
          setActiveLanguage(savedLang);
          i18n.changeLanguage(savedLang);
        } else {
          const deviceLanguage = RNLocalize.getLocales()[0]?.languageCode;
          const defaultLang = Object.values(languages).includes(deviceLanguage)
            ? deviceLanguage
            : 'de'; // Fallback to German
          setActiveLanguage(defaultLang);
          i18n.changeLanguage(defaultLang);
          await AsyncStorage.setItem('language', defaultLang);
        }
      } catch (error) {
        console.error('Error setting default language:', error);
      }
    };

    setDefaultLanguage();
  }, []);

  const handleLanguageChange = async country => {
    const selectedLang = languages[country];
    setActiveLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    await AsyncStorage.setItem('language', selectedLang);
    console.log(`Language set to ${selectedLang}`);
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
  }, []);
  // --------------- METHODS ---------------
  const loginAPI = () => {
    console.log(userEmail, userPassword);

    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('email', userEmail);
      formdata.append('password', userPassword);
      formdata.append('device_id', '13213211');
      formdata.append('lang', activeLanguage);
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
      console.log('error', error);
    }
  };
  function validateInputs() {
    if (userEmail == '' || userEmail == null) {
      toastMessage.error('Please enter email address!');
      return false;
    }
    if (!Validator.validateEmail(userEmail)) {
      toastMessage.error('Please enter valid email address');

      return false;
    }
    if (userPassword === '') {
      toastMessage.error('Please enter password');
      return false;
    }
    return true;
  }

  const onLoginPress = () => {
    console.log('Loginpressed');
    if (!isConnected) {
      toastMessage.error('Please check your internet connection');
    } else {
      if (validateInputs('Enter Email')) {
        // changeLanguage('pl');
        loginAPI();
      }
    }
  };
  const onForgotPasswordPress = () => {
    if (!isConnected) {
      toastMessage.error('Please check your internet connection');
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
          contentContainerStyle={{flexGrow: 1}}
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
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={onLoginPress}>
              <Text style={styles.buttonTextStyle}>
                {t('Login.loginButton')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotPasswordStyle}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('ForgotPass')}>
              <Text style={styles.forgotPasswordText}>
                {t('Login.forgotPassword')}
              </Text>
            </TouchableOpacity>
            <View style={styles.FlagContainer}>
              {Object.keys(languages).map(country => (
                <TouchableOpacity
                  key={country}
                  onPress={() => handleLanguageChange(country)}
                  style={[
                    styles.touchable,
                    activeLanguage &&
                      activeLanguage !== languages[country] &&
                      styles.inactive,
                  ]}>
                  <FlagComponent Country={country} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FullScreenSpinner>
  );
};

export default Login;
