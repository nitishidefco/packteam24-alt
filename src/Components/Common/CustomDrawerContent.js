import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../../Config';
import {Matrics, typography} from '../../Config/AppStyling';
import colors from '../../Config/AppStyling/colors';
import {useAuthActions} from '../../Redux/Hooks';
import DropdownAlert from 'react-native-dropdownalert';
import {toastMessage} from '../../Helpers';
import {reduxStorage} from '../../Redux/Storage';
import {useTranslation} from 'react-i18next';
import { success } from '../../Helpers/ToastMessage';
// import DailyListScreen from '../../screens/DailyList/DailyListScreen';

const CustomDrawerContent = props => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {state, logoutCall} = useAuthActions();
  const {Auth} = state;
  const SessionId = Auth.data?.data?.sesssion_id;
  const [dropdownAlert, setDropdownAlert] = useState(null);
  const [isIos, setIsIos] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      setIsIos(true);
    }
  }, []);

  const goToHome = () => {
    navigation.replace('Home');
  };
  const goToDailyList = () => {
    navigation.navigate('DailyListScreen');
  };

  useEffect(() => {
    handleLogoutResponse();
  }, [Auth?.islogoutSuccess]);

  function logoutApi() {
    setLoading(true);
    let formdata = new FormData();
    formdata.append('session_id', SessionId);
    formdata.append('device_id', '123');
    logoutCall(formdata);
    console.log(formdata, 'dataaaa');
  }
  function handleLogoutResponse() {
    console.log('Auth.islogoutSuccess', Auth.islogoutSuccess);
    if (loading && Auth.islogoutSuccess === true) {
      setLoading(false);
      success('Logout successful');
      reduxStorage.removeItem('token');
      navigation.replace('Login');
    } else if (loading && Auth.islogoutSuccess === false) {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        style={styles.drawerContent}
        scrollEnabled={false}>
        {/* Application Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={Images.NEW_APP_LOGO}
            resizeMode="contain"
            style={styles.logoStyle}
          />
        </View>
        {/* Drawer Items */}
        <DrawerItem
          label={() => (
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Regular,
                fontSize: typography.fontSizes.fs15,
                color: colors.WHITE,
                marginHorizontal: Matrics.ms(-45),
                flexWrap: 'wrap', // Ensures text wraps to the next line
              }}
              numberOfLines={2} // Optional: Limits the number of lines to 2
              ellipsizeMode="tail" // Optional: Adds ellipsis if the text overflows
            >
              {t('SideMenuBar.dashboard')}
            </Text>
          )}
          onPress={() => navigation.replace('UserProfile')}
          style={[styles.drawerItem]}
          icon={() => (
            <Image
              source={Images.DASHBOARD}
              resizeMode="contain"
              style={[isIos ? styles.homeIconIosStyle : styles.homeIconStyle]}
            />
          )}
        />

        <DrawerItem
          label={() => (
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Regular,
                fontSize: typography.fontSizes.fs15,
                color: colors.WHITE,
                marginHorizontal: Matrics.ms(-45),
                flexWrap: 'wrap', // Ensures text wraps to the next line
              }}
              numberOfLines={2} // Optional: Limits the number of lines to 2
              ellipsizeMode="tail" // Optional: Adds ellipsis if the text overflows
            >
              {t('SideMenuBar.ChangePassword')}
            </Text>
          )}
          onPress={() => navigation.replace('ChangePassword')}
          style={[styles.drawerItem]}
          icon={() => (
            <Image
              source={Images.CHANGE_PASSWORD}
              resizeMode="contain"
              style={[isIos ? styles.homeIconIosStyle : styles.homeIconStyle]}
            />
          )}
        />

        <DrawerItem
          label={() => (
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.Regular,
                fontSize: typography.fontSizes.fs15,
                color: colors.WHITE,
                marginHorizontal: Matrics.ms(-45),
                flexWrap: 'wrap', // Ensures text wraps to the next line
              }}
              numberOfLines={2} // Optional: Limits the number of lines to 2
              ellipsizeMode="tail" // Optional: Adds ellipsis if the text overflows
            >
              {t('SideMenuBar.UserProflie')}
            </Text>
          )}
          onPress={() => navigation.replace('UserProfile')}
          style={[styles.drawerItem]}
          icon={() => (
            <Image
              source={Images.CHANGE_PASSWORD}
              resizeMode="contain"
              style={[isIos ? styles.homeIconIosStyle : styles.homeIconStyle]}
            />
          )}
        />

        {/* <DrawerItem {t('SideMenuBar.ChangePassword')}
          label="Messages"
          labelStyle={{
            fontFamily: typography.fontFamily.Montserrat.Regular,
            fontSize: typography.fontSizes.fs15,
            color: colors.WHITE,
            paddingTop: Matrics.ms(10),
            marginHorizontal: Matrics.ms(-40),
          }}
          // onPress={goToHome}
          style={styles.drawerItem}
          icon={() => (
            <Image
              source={Images.MESSAGES_ICON}
              resizeMode="contain"
              style={[isIos ? styles.messageIconIosStyle : styles.messageIconStyle]}
            />
          )}
        />
        <DrawerItem
          label="Daily Lists"
          labelStyle={{
            fontFamily: typography.fontFamily.Montserrat.Regular,
            fontSize: typography.fontSizes.fs15,
            color: colors.WHITE,
            paddingTop: Matrics.ms(10),

            marginHorizontal: Matrics.ms(-40),
          }}
           onPress={goToDailyList}
          style={styles.drawerItem}
          icon={() => (
            <Image
              source={Images.DAILY_LIST}
              resizeMode="contain"
              style={[isIos ? styles.messageIconIosStyle : styles.messageIconStyle]}
            />
          )}
        />
        <DrawerItem
          label="Calender"
          labelStyle={{
            fontFamily: typography.fontFamily.Montserrat.Regular,
            fontSize: typography.fontSizes.fs15,
            color: colors.WHITE,
            paddingTop: Matrics.ms(10),
            marginHorizontal: Matrics.ms(-40),
          }}
          // onPress={goToHome}
          style={styles.drawerItem}
          icon={() => (
            <Image
              source={Images.CALENDER_ICON}
              resizeMode="contain"
              style={[isIos ? styles.messageIconIosStyle : styles.messageIconStyle]}

            />
          )}
        />
        <DrawerItem
          label="Advances"
          labelStyle={{
            fontFamily: typography.fontFamily.Montserrat.Regular,
            fontSize: typography.fontSizes.fs15,
            color: colors.WHITE,
            paddingTop: Matrics.ms(10),
            marginHorizontal: Matrics.ms(-40),
            paddingBottom: Matrics.ms(20),
          }}
          // onPress={goToHome}
          style={styles.drawerItem}
          icon={() => (
            <Image
              source={Images.ADVANCES}
              resizeMode="contain"
              style={[isIos? styles.dashBoardIconIosStyle:styles.dashBoardIconStyle]}
            />
          )}
        /> */}
      </DrawerContentScrollView>
      {/* Logout */}
      <View
        style={{
          justifyContent: 'flex-end',
          marginBottom: Matrics.ms(45),
          marginLeft: Matrics.ms(13),
        }}>
        <DrawerItem
          label={t('SideMenuBar.Logout')}
          labelStyle={{
            fontFamily: typography.fontFamily.Montserrat.Regular,
            fontSize: typography.fontSizes.fs15,
            color: colors.WHITE,
            marginHorizontal: Matrics.ms(-30),
            marginBottom: Matrics.ms(-5),
            bottom: Matrics.ms(3),
          }}
          onPress={logoutApi}
          style={styles.drawerItem}
          icon={() => (
            <Image
              source={Images.LOGOUT_ICON}
              resizeMode="contain"
              style={[
                isIos ? styles.logoutIconIosStyle : styles.logoutIconStyle,
              ]}
            />
          )}
        />
      </View>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          // left: Matrics.ms(80),
          marginBottom: Matrics.ms(30),
          fontFamily: typography.fontFamily.Montserrat.Medium,
          fontSize: typography.fontSizes.fs13,
        }}>
        v. 2.5.25
      </Text>
      <DropdownAlert ref={ref => setDropdownAlert(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061439',
  },
  drawerContent: {
    backgroundColor: '#061439',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: Matrics.ms(10),
    paddingBottom: Matrics.ms(15),
  },
  logoStyle: {
    width: Matrics.ms(172),
    height: Matrics.ms(40),
    left: 0,
  },
  drawerItem: {
    marginLeft: 0,
  },
  homeIconIosStyle: {
    width: Matrics.ms(20),
    height: Matrics.ms(19),
    marginRight: 55,
  },
  messageIconIosStyle: {
    width: Matrics.ms(24),
    height: Matrics.ms(22),
    marginRight: 45,
    marginTop: 10,
  },
  homeIconStyle: {
    width: Matrics.ms(20),
    height: Matrics.ms(19),
    marginRight: Matrics.ms(55),
    // paddingLeft: Matrics.ms(80),
  },
  messageIconStyle: {
    width: Matrics.ms(24),
    height: Matrics.ms(22),
    marginRight: Matrics.ms(45),
    // paddingLeft: Matrics.ms(80),
    marginTop: Matrics.ms(10),
  },
  dashBoardIconIosStyle: {
    width: Matrics.ms(22),
    height: Matrics.ms(19),
    marginRight: 45,
    marginBottom: 10,
  },
  dashBoardIconStyle: {
    width: Matrics.ms(22),
    height: Matrics.ms(20),
    marginRight: Matrics.ms(45),
    // paddingLeft: Matrics.ms(80),
    marginTop: Matrics.vs(-8),
  },
  logoutIconStyle: {
    width: Matrics.ms(24),
    height: Matrics.ms(24),
    marginRight: Matrics.ms(45),
    // paddingLeft: Matrics.ms(80),
    // tintColor: 'red',
    marginBottom: Matrics.ms(0),
  },
  logoutIconIosStyle: {
    width: Matrics.ms(24),
    height: Matrics.ms(24),
    marginRight: Matrics.ms(32),
  },
});

export default CustomDrawerContent;
