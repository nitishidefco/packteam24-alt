// Splash.js
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, PermissionsAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Images from './Config/Images';
import {reduxStorage} from './Redux/Storage';
import {useWorkHistoryActions} from './Redux/Hooks/useWorkHistoryActions';
import {useNotificationActions} from './Redux/Hooks/useNotificationActions';
import { useSelector } from 'react-redux';
import { useAuthActions } from './Redux/Hooks';
const Splash = () => {
  const {getRealTimeCall} = useWorkHistoryActions();
  

  const [userToken, setuserToken] = useState(null);
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
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
    <View style={styles.container}>
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
    backgroundColor: '#061439',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Splash;
