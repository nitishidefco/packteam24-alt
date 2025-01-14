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
  StyleSheet,
} from 'react-native';
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

const ForgotPass = () => {
  const navigation = useNavigation();

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
                source={Images.LOGIN_LOGO}
                style={{
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  height: Matrics.ms(68),
                  width: Matrics.ms(290),
                }}
              />
            </View>
            <Text style={styles.loginText}>Reset password</Text>
            <Text style={styles.loginText2}>
              Provide the email address you use to log in to the application –
              we will send instructions for resetting your password.
            </Text>
            <View style={[styles.SectionStyle]}>
              <Text
                style={{
                  position: 'absolute',
                  bottom: Matrics.ms(50),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: '#555555',
                }}>
                Email ID
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
                placeholder={'Email'}
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

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={onForgotPasswordPress}>
              <Text style={styles.buttonTextStyle}>
                Send Password Reset Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={inLineStyles.goBack}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </FullScreenSpinner>
  );
};

const inLineStyles = StyleSheet.create({
  goBack: {
    textAlign: 'center',
    fontSize: typography.fontSizes.fs17,
    fontWeight: 'bold',
  },
});

export default ForgotPass;
