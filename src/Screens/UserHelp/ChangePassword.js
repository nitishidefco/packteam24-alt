import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {ThemeContext} from '../../Components/Provider/ThemeProvider';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import colors from '../../Config/AppStyling/colors';
import {Images} from '../../Config';
import {useChangePasswordActions} from '../../Redux/Hooks/useChangePasswordActions';
import useSavedLanguage from '../../Components/Hooks/useSavedLanguage';
import {useHomeActions} from '../../Redux/Hooks';
import ToastMessage, {errorToast} from '../../Helpers/ToastMessage';
import {useTranslation} from 'react-i18next';
import {SafeAreaComponent} from '../../Components/HOC';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import CustomHeader from '../../Components/Common/CustomHeader';
import LanguageSelector from '../../Components/Common/LanguageSelector';
import {useTheme} from '../../Context/ThemeContext';

const ChangePassword = ({navigation}) => {
  const theme = useTheme();
  const {passwordState, changePasswordCall} = useChangePasswordActions();
  // const lang = useSavedLanguage();
  const {state} = useHomeActions();
  const {Auth} = state;
  const {t, i18n} = useTranslation();
  const SessionId = Auth.data?.data?.sesssion_id;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const isConnected = useSelector(state => state?.Network?.isConnected);
  // Handle input field changes
  const handleChange = (name, value) => {
    switch (name) {
      case 'currentPassword':
        setCurrentPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmNewPassword':
        setConfirmNewPassword(value);
        break;
      default:
        console.warn(`Unhandled input name: ${name}`);
    }
  };
  console.log('Password state', passwordState);

  const handlePasswordChange = () => {
    if (isConnected) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        const errorMessage = `${t('ChangePasswordScreen.allFieldsRequired')}`;
        errorToast(errorMessage);
        return;
      }
      Alert.alert(
        t('ChangePasswordScreen.confirmNewPassword'),
        t('ChangePasswordScreen.changeConfirmation'),
        [
          {
            text: t('ChangePasswordScreen.no'),
            style: 'cancel',
          },
          {
            text: t('ChangePasswordScreen.yes'),
            onPress: () => {
              const formData = new FormData();
              formData.append('session_id', SessionId);
              formData.append('device_id', deviceId);
              formData.append('lang', globalLanguage);
              formData.append('current_password', currentPassword);
              formData.append('new_password', newPassword);
              formData.append('confirm_new_password', confirmNewPassword);
              changePasswordCall(formData, navigation);
            },
          },
        ],
      );
    } else {
      Alert.alert(
        i18n.t('Offline.NoInternet'),
        i18n.t('Offline.FeatureNotAvailable'),
        [{text: 'OK', onPress: () => navigation.navigate('HomeDrawer')}],
      );
    }
  };

  const handleCancel = () => {
    Alert.alert(
      t('ChangePasswordScreen.cancelChanges'),
      t('ChangePasswordScreen.confirmationCancel'),
      [
        {
          text: t('ChangePasswordScreen.no'),
          style: 'cancel',
        },
        {
          text: t('ChangePasswordScreen.yes'),
          onPress: () => {
            // Clear any password fields if they exist in your state
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

            // Navigate to HomeDrawer
            navigation.replace('HomeDrawer');
          },
        },
      ],
    );
  };
  /* -------------------------------- language -------------------------------- */
  const language = useSavedLanguage();
  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language); // Change language once it's loaded
    }
  }, [language]);

  /* ---------------------------- Keyboard listener --------------------------- */
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

  useEffect(() => {
    if (confirmNewPassword.length > 0) {
      if (newPassword !== confirmNewPassword) {
        const passwordE = `${t('ChangePasswordScreen.passwordError')}`;
        setPasswordError(passwordE);
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  }, [newPassword, confirmNewPassword]);

  useEffect(() => {
    i18n.changeLanguage('en');
  }, []);
  const eyeIconStyle = passwordError
    ? {transform: [{translateY: -10}]}
    : {transform: [{translateY: 3}]};
  return passwordState?.isLoading ? (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={'large'} color={COLOR.AUDIO_PLAYER_BG} />
        <Text
          style={{
            fontFamily: typography.fontFamily.Montserrat.Medium,
            fontSize: typography.fontSizes.fs18,
            textAlign: 'center',
          }}>
          {i18n.t('Loading.PassWait')}
        </Text>
      </View>
    </SafeAreaView>
  ) : (
    <DrawerSceneWrapper>
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader />
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
                styles.changePasswordHeader,
                {
                  backgroundColor: theme.PRIMARY,
                },
              ]}>
              <Text style={styles.headerTitle}>
                {t('ChangePasswordScreen.changePasswordHeader')}
              </Text>
            </View>
            <View
              style={{
                position: 'relative',
                alignItems: 'flex-end',
                paddingHorizontal: Matrics.s(10),
                marginBottom: Matrics.vs(70),
                marginTop:
                  Platform.OS === 'android' ? Matrics.vs(-10) : Matrics.vs(10),
              }}>
              <LanguageSelector sessionId={SessionId} />
            </View>
            <View
              style={[
                styles.mainBody(theme),
                keyboardVisible && {marginBottom: 80},
              ]}>
              <View style={styles.mainContainerInput}>
                {/* Current Password */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTitle}>
                    {t('ChangePasswordScreen.currentPassword')}
                  </Text>
                  <TextInput
                    style={styles.inputField}
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={text => handleChange('currentPassword', text)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }>
                    <Image
                      source={
                        showCurrentPassword ? Images.EYE_OPEN : Images.EYE_CLOSE
                      }
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* New Password */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTitle}>
                    {t('ChangePasswordScreen.newPassword')}
                  </Text>
                  <TextInput
                    style={styles.inputField}
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={text => handleChange('newPassword', text)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Image
                      source={
                        showNewPassword ? Images.EYE_OPEN : Images.EYE_CLOSE
                      }
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm New Password */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTitle}>
                    {t('ChangePasswordScreen.confirmNewPassword')}
                  </Text>
                  <TextInput
                    style={[
                      styles.inputField,
                      passwordError ? {borderColor: 'red'} : null,
                    ]}
                    value={confirmNewPassword}
                    onChangeText={text =>
                      handleChange('confirmNewPassword', text)
                    }
                    secureTextEntry={!showConfirmNewPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconContainer}
                    onPress={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }>
                    <Image
                      source={
                        showConfirmNewPassword
                          ? Images.EYE_OPEN
                          : Images.EYE_CLOSE
                      }
                      style={[styles.eyeIcon, eyeIconStyle]}
                    />
                  </TouchableOpacity>
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.actionButtonContainer}>
                <View>
                  <TouchableOpacity
                    style={[styles.actionButtonPrimary, styles.actionButton]}
                    onPress={() => handlePasswordChange()}>
                    <Text style={styles.actionButtonText}>
                      {t('ChangePasswordScreen.save')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                    onPress={() => handleCancel()}>
                    <Text style={styles.actionButtonText}>
                      {t('ChangePasswordScreen.cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#EBF0FA',
    // backgroundColor:'red'
    paddingTop: 0,
  },
  mainBody: theme => ({
    flex: 1,

    backgroundColor: '#EBF0FA',
    alignContent: 'center',
    marginHorizontal: Matrics.s(15),
    marginVertical: Matrics.s(10),
  }),
  headerTitle: {
    color: '#fff',
    fontSize: typography.fontSizes.fs15,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  changePasswordHeader: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  mainContainerInput: {
    marginHorizontal: Matrics.s(18),
    marginBottom: Matrics.s(22),
  },
  inputContainer: {
    marginBottom: Matrics.vs(14),
  },
  inputTitle: {
    fontSize: typography.fontSizes.fs17,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: colors.BLACK,
    marginBottom: Matrics.vs(4),
  },
  inputField: {
    borderColor: colors.GRAY,
    borderWidth: 2,
    borderRadius: Matrics.ms(6),
    paddingLeft: Matrics.s(10),
    color: colors.BLACK,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs15,
    height: Matrics.vs(40),
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '20',
  },
  actionButtonText: {
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    fontSize: typography.fontSizes.fs15,
    color: colors.WHITE,
  },
  actionButtonPrimary: {
    backgroundColor: colors.SUCCESS,
  },
  actionButtonSecondary: {
    backgroundColor: colors.SECONDARY,
  },
  actionButton: {
    paddingHorizontal: Matrics.ms(18),
    paddingVertical: Matrics.vs(5),
    borderRadius: Matrics.s(4),
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{translateY: 3}],
  },
  eyeIcon: {
    width: Matrics.s(20),
    height: Matrics.s(20),
  },
  errorText: {
    color: 'red',
    fontSize: typography.fontSizes.fs13,
    fontFamily: typography.fontFamily.Montserrat.Medium,
    marginTop: 4,
  },
});

export default ChangePassword;
