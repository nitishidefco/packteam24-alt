// Splash.js
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Images from './Config/Images';
import {reduxStorage} from './Redux/Storage';
const Splash = () => {
  const [userToken, setuserToken] = useState(null);

  // fetch user token initally
  useEffect(() => {
    async function getToken() {
      let token = await reduxStorage.getItem('token');
      setuserToken(token);
    }
    getToken();
  }, [userToken]);
  const navigation = useNavigation();

  useEffect(() => {
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
        source={Images.SPLASH_ICON}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091242',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Splash;
