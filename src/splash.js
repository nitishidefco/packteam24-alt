// Splash.js
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, PermissionsAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Images from './Config/Images';
import {reduxStorage} from './Redux/Storage';
import {useWorkHistoryActions} from './Redux/Hooks/useWorkHistoryActions';
import {useNotificationActions} from './Redux/Hooks/useNotificationActions';
import {useDispatch, useSelector} from 'react-redux';
import {useAuthActions} from './Redux/Hooks';
import {COLOR} from './Config/AppStyling';
import {changeAppColor} from './Redux/Reducers/CustomizationSlice';
import {useTheme} from './Context/ThemeContext';

const Splash = () => {
  const {getRealTimeCall} = useWorkHistoryActions();
  const dispatch = useDispatch();
  const [userToken, setuserToken] = useState(null);
  const {isLoading} = useSelector(state => state.Customization);

  const theme = useTheme();
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, []);
  useEffect(() => {
    dispatch(changeAppColor());
  }, []);
  // fetch user token initally
  useEffect(() => {
    async function getToken() {
      let token = await reduxStorage.getItem('token');
      setuserToken(token);
    }
    getToken();
  }, [userToken]);
  // fetch device info

  const navigation = useNavigation();

  // Set the nfc tags to local storage

  useEffect(() => {
    getRealTimeCall();

    const timer = setTimeout(() => {
      {
        userToken != null
          ? navigation.replace('HomeDrawer')
          : navigation.replace('Login');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation, userToken]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLOR.PURPLE,
        },
      ]}>
      <Image
        source={Images.NEW_APP_LOGO}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Splash;
