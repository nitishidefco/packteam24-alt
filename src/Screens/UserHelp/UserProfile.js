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
  Alert
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import React, {useEffect, useState} from 'react';
import useSavedLanguage from '../../Components/Hooks/useSavedLanguage';
import {loginStyle} from '../Auth/styles';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {useTranslation} from 'react-i18next';
import {Images} from '../../Config';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../Config/AppStyling/colors';
import {useUserProfileActions} from '../../Redux/Hooks/useUserProfileActions';
import {useHomeActions} from '../../Redux/Hooks';

const UserProfile = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const language = useSavedLanguage();
  const {
    profileState,
    fetchUserProfileCall,
    updateUserProfileCall,
    removeUserProfilePhotoCall,
  } = useUserProfileActions();
  const {state} = useHomeActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [counter, setCounter] = useState(0);

  const [userEmail, setUserEmail] = useState(null);
  const [image, setImage] = useState(null);
  const requestAndroidPermission = async () => {
    try {
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
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  // console.log(Matrics.screenHeight);

  const pickImage = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestAndroidPermission();
      if (!hasPermission) {
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  /* -------------------------------- Lifecycle ------------------------------- */
  useEffect(() => {
    const formData = new FormData();
    formData.append('session_id', SessionId);
    formData.append('device_id', '13213211');
    formData.append('lang', language);
    fetchUserProfileCall(formData);
  }, [counter]);

  /* --------------------------- Set data of profile -------------------------- */
  useEffect(() => {
    setImage(profileState?.data?.photo);
    setUserEmail(profileState?.data?.email);
  }, [profileState]);

  /* ----------------------------- Handle changes ----------------------------- */
  const handleSave = async () => {
    if (!userEmail) {
      console.error('Email is required!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('session_id', SessionId);
      formData.append('device_id', '13213211');
      formData.append('lang', language);
      formData.append('email', userEmail);

      if (image) {
        formData.append('photo', {
          uri: image,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      updateUserProfileCall(formData);
      setCounter(prevCounter => prevCounter + 1);
       navigation.replace('HomeDrawer');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
   Alert.alert(
     'Cancel Changes',
     'Are you sure you want to cancel? All unsaved changes will be lost.',
     [
       {
         text: 'Keep Editing',
         style: 'cancel',
       },
       {
         text: 'Discard Changes',
         style: 'destructive',
         onPress: () => {
           console.log('Cancelling changes...');
           setImage(profileState?.data?.photo || null);
           setUserEmail(profileState?.data?.email || '');
           navigation.replace('HomeDrawer');
         },
       },
     ],
   );
  };
  const handleRemoveProfilePhoto = () => {
     Alert.alert(
       'Remove Profile Photo',
       'Are you sure you want to remove your profile photo?',
       [
         {
           text: 'Cancel',
           style: 'cancel',
         },
         {
           text: 'Remove',
           style: 'destructive',
           onPress: async () => {
             try {
               const formData = new FormData();
               formData.append('session_id', SessionId);
               formData.append('device_id', '13213211');
               formData.append('lang', language);
               removeUserProfilePhotoCall(formData);
               setCounter(prevCounter => prevCounter + 1);
             } catch (error) {
               Alert.alert(
                 'Error',
                 'Failed to remove profile photo. Please try again.',
                 [{text: 'OK'}],
               );
               console.error('Error removing profile photo:', error);
             }
           },
         },
       ],
     );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        enabled>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.imageContainer}>
                {image ? (
                  <Image
                    source={{uri: image}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>Add Photo</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.imageActionButton}>
                <TouchableOpacity onPress={pickImage} style={styles.button}>
                  <Text style={styles.buttonText}>
                    {image ? 'Change Photo' : 'Select Photo'}
                  </Text>
                </TouchableOpacity>
                {image && (
                  <TouchableOpacity
                    onPress={() => handleRemoveProfilePhoto()}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Remove Photo</Text>
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
                {t('Login.email')}
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
                placeholder={t('Login.emailPlaceHolder')}
                placeholderTextColor={'gray'}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    backgroundColor: '#061439',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
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
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
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
  },
  button: {
    backgroundColor: '#061439',
    paddingHorizontal: 15,
    color: COLOR.PRIMARY,
    borderColor: COLOR.PRIMARY,
    paddingVertical: 10,
    borderRadius: Matrics.ms(16),

    ...Platform.select({
      ios: {
        shadowColor: '#0A1931',
        shadowOffset: {
          width: 0,
          height: 1,
        },
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
    // flex: '1',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 20,
    marginBottom: 10,
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
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 3,
      },
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
});

export default UserProfile;
