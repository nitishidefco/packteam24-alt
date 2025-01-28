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
const languages = {
  POL: 'pl', // Polish
  GER: 'de', // German
  UK: 'en', // English
  RUS: 'ru', // Russian
  UKA: 'uk', // Ukrainian
  ZH: 'cn', //chinese
};
const CreateAccount = () => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const privacyPolicyUrl = 'https://eda.workflex360.de/api/privacy-policy';
  const applicationInformatinoUrl =
    'https://eda.workflex360.de/api/application-information';
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
  const {createAccountCall} = useAuthActions();
  const {Auth} = useSelector(state => state);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);

  useEffect(() => {
    dispatch(initializeLanguage());
  }, []);
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
  }, []);

  const createAccountApi = () => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append('email', userEmail);
      formdata.append('password', userPassword);
      formdata.append('lang', globalLanguage);
      createAccountCall(formdata, navigation);
    } finally {
      // setLoading(false);
      // navigation.navigate('Login');
    }
  };

  function validateInputs() {
    if (userEmail == '' || userEmail == null) {
      errorToast(i18n.t('Toast.EnterEmail'));
      return false;
    }
    if (!Validator.validateEmail(userEmail)) {
      errorToast(i18n.t('Toast.ValidEmail'));

      return false;
    }
    if (userPassword === '') {
      errorToast(i18n.t('Toast.EnterPassword'));
      return false;
    }
    return true;
  }

  const onCreateAccountPress = () => {
    if (!isConnected) {
      errorToast(i18n.t('Toast.CheckInternet'));
    } else {
      if (validateInputs('Enter Email')) {
        // changeLanguage('pl');
        createAccountApi();
      }
    }
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
            <Text style={styles.loginText}>{t('CreateAccount.title')}</Text>
            <Text style={styles.loginText2}>{t('CreateAccount.subt')}</Text>
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
              onPress={onCreateAccountPress}>
              <Text style={styles.buttonTextStyle}>
                {/* {t('Login.loginButton')} */}
                {t('CreateAccount.createAccButton')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotPasswordStyle}
              activeOpacity={0.5}
              onPress={() => navigation.replace('Login')}>
              <Text style={styles.forgotPasswordText}>
                {/* {t('Login.forgotPassword')} */}
                {t('CreateAccount.btl')}
              </Text>
            </TouchableOpacity>

            <View style={styles.FlagContainer}>
              {Object.keys(languages).map(country => (
                <TouchableOpacity
                  key={country}
                  onPress={() => handleLanguageChange(country)}
                  style={[
                    styles.touchable,
                    globalLanguage &&
                      globalLanguage !== languages[country] &&
                      styles.inactive,
                  ]}>
                  <FlagComponent Country={country} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={{marginBottom: Matrics.ms(20)}}>
              <OpenURLText url={privacyPolicyUrl}>{t('Login.pp')}</OpenURLText>
              <OpenURLText url={applicationInformatinoUrl}>
                {t('Login.ai')}
              </OpenURLText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FullScreenSpinner>
  );
};

export default CreateAccount;
