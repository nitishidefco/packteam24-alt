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
const Login = ({route}) => {
  // --------------- FUNCTION DECLARATION ---------------
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
  const [dropdownAlert, setDropdownAlert] = useState(null);
  const {state, loginCall} = useAuthActions();
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
      formdata.append('device_id', deviceId);
      loginCall(formdata);
    } finally {
      // setLoading(false);
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
        loginAPI();
      }
    }
  };

  const hideStatusBar = () => {
    StatusBar.setHidden(true);
  };

  return (
    <FullScreenSpinner>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainBody(theme)}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            enabled>
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
            <Text style={styles.loginText}>Login to your account</Text>
            <Text style={styles.loginText2}>
              Enter your email & password to login
            </Text>
            <View style={styles.SectionStyle}>
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
            <View style={styles.SectionStyle}>
              <Text
                style={{
                  position: 'absolute',
                  bottom: Matrics.ms(50),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: '#555555',
                }}>
                Password
              </Text>

              <Image
                source={Images.PASSWORD}
                resizeMode={'contain'}
                style={styles.loginInputIconStyle}
              />
              <TextInput
                style={styles.inputStyle}
                onChangeText={userPassword => setUserPassword(userPassword)}
                placeholder={'Password'}
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
              <Text style={styles.buttonTextStyle}>Login</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      <Loader visible={loading} />
      <DropdownAlert ref={ref => setDropdownAlert(ref)} />
    </FullScreenSpinner>
  );
};

export default Login;
