import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import React, {useEffect, useState, useRef} from 'react';
import useSavedLanguage from '../../Components/Hooks/useSavedLanguage';
import {loginStyle} from '../Auth/styles';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {useTranslation} from 'react-i18next';
import {Images, setHeader} from '../../Config';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../Config/AppStyling/colors';
import {useUserProfileActions} from '../../Redux/Hooks/useUserProfileActions';
import {useHomeActions} from '../../Redux/Hooks';
import {useSelector} from 'react-redux';
import {Validator} from '../../Helpers';
import {errorToast} from '../../Helpers/ToastMessage';
import DrawerSceneWrapper from '../../Components/Common/DrawerSceneWrapper';
import CustomHeader from '../../Components/Common/CustomHeader';
import LanguageSelector from '../../Components/Common/LanguageSelector';

const UserProfile = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const isConnected = useSelector(state => state?.Network?.isConnected);
  const language = useSavedLanguage();
  const {
    profileState,
    fetchUserProfileCall,
    updateUserProfileCall,
    removeUserProfilePhotoCall,
    removeAccountCall,
  } = useUserProfileActions();
  const {state} = useHomeActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [counter, setCounter] = useState(0);

  const [userEmail, setUserEmail] = useState(null);
  const [image, setImage] = useState(null);
  const {deviceId} = useSelector(state => state?.Network);
  const {globalLanguage} = useSelector(state => state?.GlobalLanguage);
  const [error, setError] = useState(null);
  const [notificationLanguage, setNotificationLanguage] = useState('de');
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const modalAnimation = useRef(new Animated.Value(0)).current;

  const languageOptions = [
    {label: 'English', value: 'en'},
    {label: 'Polish', value: 'pl'},
    {label: 'German', value: 'de'},
    {label: 'Russian', value: 'ru'},
    {label: 'Ukrainian', value: 'ua'},
    {label: 'Chinese', value: 'zh'},
  ];
  const NOTIFICATION_LANGUAGE_KEY = 'notificationLanguage';

  const saveNotificationLanguage = async lang => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_LANGUAGE_KEY, lang);
      console.log('Notification language saved to AsyncStorage:', lang);
    } catch (error) {
      console.error(
        'Error saving notification language to AsyncStorage:',
        error,
      );
    }
  };

  const loadNotificationLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(
        NOTIFICATION_LANGUAGE_KEY,
      );
      console.log(
        'Loaded notification language from AsyncStorage:',
        savedLanguage,
      );
      if (
        savedLanguage &&
        languageOptions.some(option => option.value === savedLanguage)
      ) {
        setNotificationLanguage(savedLanguage);
      } else {
        setNotificationLanguage('de');
      }
    } catch (error) {
      console.error(
        'Error loading notification language from AsyncStorage:',
        error,
      );
      setNotificationLanguage('de');
    }
  };

  useEffect(() => {
    loadNotificationLanguage();
  }, []);

  const requestAndroidPermission = async () => {
    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Photo Access Required',
            message: 'App needs access to your photos to set profile picture',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Photo Access Required',
            message: 'App needs access to your photos to set profile picture',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const pickImage = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestAndroidPermission();
      if (!hasPermission) {
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 800,
      maxWidth: 800,
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
      } else if (response.errorCode) {
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    } catch (error) {}
  };

  useEffect(() => {
    setCounter(0);
  }, []);

  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', SessionId);
    formData.append('device_id', deviceId);
    formData.append('lang', globalLanguage);

    fetchUserProfileCall(formData);
  }, [profileState?.isLoading]);

  useEffect(() => {
    try {
      const photoData = profileState?.data?.photo;

      setError(null);

      if (typeof photoData === 'object' && photoData !== null) {
        const errorMessage = Array.isArray(photoData.photo)
          ? photoData.photo[0]
          : 'Invalid image format';
        setError(errorMessage);
        setImage(null);
      } else if (typeof photoData === 'string') {
        setImage(photoData);
      } else {
        setImage(null);
        setError('No image available');
      }

      setUserEmail(profileState?.data?.email || null);
    } catch (error) {
      console.error('Error processing profile data:', error);
      setError('Error loading profile data');
      setImage(null);
    }
  }, [profileState, counter]);

  function validateInputs() {
    if (userEmail === '' || userEmail === null) {
      errorToast(i18n.t('Toast.EnterEmail'));
      return false;
    }
    if (!Validator.validateEmail(userEmail)) {
      errorToast(i18n.t('Toast.ValidEmail'));
      return false;
    }
    return true;
  }

  const handleSave = async () => {
    if (isConnected) {
      if (validateInputs()) {
        try {
          const formData = new FormData();
          formData.append('session_id', SessionId);
          formData.append('device_id', deviceId);
          formData.append('lang', globalLanguage);
          formData.append('email', userEmail);
          formData.append('language', notificationLanguage);
          if (image) {
            const imageType = image.includes('.png')
              ? 'image/png'
              : 'image/jpeg';
            const imageName = image.includes('.png')
              ? 'profile.png'
              : 'profile.jpg';
            formData.append('photo', {
              uri: image,
              type: imageType,
              name: imageName,
            });
          }

          updateUserProfileCall(formData);
          setCounter(prevCounter => prevCounter + 1);
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
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
      t('UserProfileScreen.cancelTitle'),
      t('UserProfileScreen.cancelConfirmation'),
      [
        {
          text: t('UserProfileScreen.keepEditing'),
          style: 'cancel',
        },
        {
          text: t('UserProfileScreen.discardChanges'),
          style: 'destructive',
          onPress: () => {
            setImage(profileState?.data?.photo || null);
            setUserEmail(profileState?.data?.email || '');
            navigation.replace('HomeDrawer');
          },
        },
      ],
    );
  };

  const handleRemoveProfilePhoto = () => {
    if (isConnected) {
      Alert.alert(
        t('UserProfileScreen.removeProfilePhoto'),
        t('UserProfileScreen.rusure'),
        [
          {
            text: t('UserProfileScreen.cancel'),
            style: 'cancel',
          },
          {
            text: t('UserProfileScreen.remove'),
            style: 'destructive',
            onPress: async () => {
              try {
                const formData = new FormData();
                formData.append('session_id', SessionId);
                formData.append('device_id', deviceId);
                formData.append('lang', globalLanguage);
                removeUserProfilePhotoCall(formData);
                setCounter(prevCounter => prevCounter + 1);
              } catch (error) {
                Alert.alert(
                  t('UserProfileScreen.Error'),
                  t('UserProfileScreen.FailedToRemove'),
                  [{text: t('UserProfileScreen.OK')}],
                );
                console.error('Error removing profile photo:', error);
              }
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

  const handleRemoveAccount = () => {
    Alert.alert(
      t('UserProfileScreen.confirmAccountRemoval'),
      t('UserProfileScreen.confirmAccountRemovalDesc'),
      [
        {
          text: t('UserProfileScreen.no'),
          style: 'cancel',
        },
        {
          text: t('UserProfileScreen.yes'),
          style: 'destructive',
          onPress: () => {
            const formData = new FormData();
            formData.append('session_id', SessionId);
            formData.append('device_id', deviceId);
            removeAccountCall(formData, navigation);
          },
        },
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Modal animation handlers
  const openModal = () => {
    setIsLanguageModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsLanguageModalVisible(false));
  };

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const renderLanguageItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        notificationLanguage === item.value && styles.selectedLanguageItem,
      ]}
      onPress={() => {
        setNotificationLanguage(item.value);
        saveNotificationLanguage(item.value);
        closeModal();
      }}>
      <Text
        style={[
          styles.languageItemText,
          notificationLanguage === item.value && styles.selectedLanguageText,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return profileState?.fetchProfileLoading ? (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.loadingContainer, styles.horizontal]}>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <ActivityIndicator size="large" color={COLOR.AUDIO_PLAYER_BG} />
          <Text
            style={{
              marginTop: 5,
              fontFamily: typography.fontFamily.Montserrat.Medium,
              fontSize: typography.fontSizes.fs18,
            }}>
            {i18n.t('Loading.Wait')}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  ) : (
    <DrawerSceneWrapper>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('UserProfileScreen.title')}</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: Platform.OS === 'ios' ? 200 : 100,
            zIndex: 10,
            alignItems: 'flex-end',
            paddingHorizontal: Matrics.s(10),
            // marginBottom: Matrics.vs(70),
          }}>
          <LanguageSelector sessionId={SessionId} />
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          enabled>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
              <View>
                <View style={styles.container}>
                  <View style={styles.imageContainer}>
                    {image ? (
                      <Image
                        source={{uri: image}}
                        style={styles.image}
                        resizeMode="cover"
                        onError={() => setError('Failed to load image')}
                      />
                    ) : (
                      <View style={styles.placeholderContainer}>
                        <View style={styles.placeholder}>
                          <Text style={styles.placeholderText}>
                            {error || 'Dummy avatar will be added if no photo'}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={styles.imageActionButton}>
                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                      <Text style={styles.buttonText}>
                        {image
                          ? t('UserProfileScreen.EditPhoto')
                          : t('UserProfileScreen.SelectPhoto')}
                      </Text>
                    </TouchableOpacity>
                    {image && (
                      <TouchableOpacity
                        onPress={() => handleRemoveProfilePhoto()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          {t('UserProfileScreen.RemovePhoto')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={[loginStyle.SectionStyle]}>
                  <Text
                    style={{
                      position: 'absolute',
                      bottom: Matrics.ms(50),
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                      color: '#555555',
                    }}>
                    {t('UserProfileScreen.email')}
                  </Text>
                  <Image
                    source={Images.EMAIL}
                    resizeMode={'center'}
                    style={loginStyle.loginInputIconStyle}
                  />
                  <TextInput
                    style={loginStyle.inputStyle}
                    onChangeText={setUserEmail}
                    value={userEmail}
                    placeholder={t('UserProfileScreen.emailPlaceHolder')}
                    placeholderTextColor={'gray'}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                  />
                </View>
                <View style={[loginStyle.SectionStyle]}>
                  <Text
                    style={{
                      position: 'absolute',
                      bottom: Matrics.ms(50),
                      fontFamily: typography.fontFamily.Montserrat.Regular,
                      color: '#555555',
                      width: Matrics.screenWidth * 0.9,
                    }}>
                    {t('UserProfileScreen.notificationLanguage')}
                  </Text>
                  <TouchableOpacity
                    style={styles.languageSelectorButton}
                    onPress={openModal}>
                    <Text style={styles.languageSelectorText}>
                      {languageOptions.find(
                        opt => opt.value === notificationLanguage,
                      )?.label || 'Select Language'}
                    </Text>
                    <Image
                      source={Images.CHEVRON_DOWN}
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View style={styles.actionContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>
                      {t('UserProfileScreen.cancel')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={handleSave}>
                    <Text style={styles.saveButtonText}>
                      {t('UserProfileScreen.save')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeAccountButton]}
                    onPress={handleRemoveAccount}>
                    <Text style={styles.saveButtonText}>
                      {t('CreateAccount.removeAccount')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Modal
          visible={isLanguageModalVisible}
          transparent
          animationType="none"
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {transform: [{translateY: modalTranslateY}]},
              ]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {t('UserProfileScreen.selectLanguage')}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.cancelModalText}>
                    {t('UserProfileScreen.cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={languageOptions}
                renderItem={renderLanguageItem}
                keyExtractor={item => item.value}
                style={styles.languageList}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </DrawerSceneWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#EBF0FA',
  },
  imageActionButton: {
    flexDirection: 'row',
    gap: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#EBF0FA',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  header: {
    height: 56,
    backgroundColor: '#061439',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {elevation: 5},
    }),
  },
  headerTitle: {
    color: '#fff',
    fontSize: typography.fontSizes.fs15,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {elevation: 5},
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#061439',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: Matrics.ms(16),
    ...Platform.select({
      ios: {
        shadowColor: '#0A1931',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.22,
        shadowRadius: 10,
      },
      android: {
        elevation: 14,
        shadowColor: '#0A1931',
        shadowRadius: 10,
      },
    }),
  },
  buttonText: {
    color: colors.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs15,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    width: '45%',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {elevation: 3},
    }),
  },
  saveButton: {
    backgroundColor: '#061439',
  },
  cancelButton: {
    backgroundColor: colors.SECONDARY,
  },
  saveButtonText: {
    color: colors.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs15,
  },
  cancelButtonText: {
    color: colors.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs15,
  },
  removeAccountButton: {
    backgroundColor: colors.PRIMARY,
    width: Matrics.screenWidth - 40,
    marginVertical: Matrics.ms(10),
    marginHorizontal: 'auto',
  },
  languageSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Matrics.ms(8),
    paddingHorizontal: Matrics.ms(10),
    paddingVertical: Platform.OS === 'android' ? 0 : Matrics.ms(12),
  },
  languageSelectorText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: '#333',
    // paddingBottom: Matrics.vs(5),
  },
  chevronIcon: {
    width: Matrics.ms(20),
    height: Matrics.ms(20),
    tintColor: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: Matrics.ms(16),
    borderTopRightRadius: Matrics.ms(16),
    padding: Matrics.ms(20),
    maxHeight: Matrics.screenHeight * 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Matrics.ms(10),
  },
  modalTitle: {
    fontFamily: typography.fontFamily.Montserrat.Bold,
    fontSize: typography.fontSizes.fs18,
    color: '#061439',
  },
  cancelModalText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: colors.PRIMARY,
  },
  languageList: {
    flexGrow: 0,
  },
  languageItem: {
    paddingVertical: Matrics.ms(12),
    paddingHorizontal: Matrics.ms(10),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedLanguageItem: {
    backgroundColor: COLOR.PRIMARY,
  },
  languageItemText: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs16,
    color: '#333',
  },
  selectedLanguageText: {
    color: colors.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
});

export default UserProfile;
