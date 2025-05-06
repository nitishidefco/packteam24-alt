// App.js
if (__DEV__) {
  require('../ReactotronConfig');
}

import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';

import Splash from './splash';
import HomeDrawer from './Components/Common/HomeDrawer';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {Store} from './Redux/Store';
import Login from './Screens/Auth/Login';
import Toast from 'react-native-toast-message';
import {toastConfig} from './Helpers';
import AddDailyList from './Screens/DailyList/AddDailyList';
import EditDailyList from './Screens/DailyList/EditDailyList';
import CreateDailyList from './Screens/DailyList/CreateDailyList';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {monitorNetworkStatus} from './Utlis/NetworkUtils';
import ForgotPass from './Screens/Auth/ForgotPass';
import CreateAccount from './Screens/Auth/CreateAccount';
// import NotificationService from './Services/NotificationService';
import NotificationInitializer from './Components/HomeComponent/NotificationInitializer';
import {ThemeProvider, useTheme} from './Context/ThemeContext';
import {Platform, StatusBar} from 'react-native';

const Stack = createStackNavigator();
const StatusBarWithTheme = () => {
  const theme = useTheme(); // Access theme from ThemeProvider

  return (
    <>
      {Platform.OS === 'ios' ? (
        <SafeAreaView style={{backgroundColor: theme.PRIMARY}} edges={['top']}>
          <StatusBar
            barStyle={theme.barStyle || 'light-content'} // Dynamic or fallback style
          />
        </SafeAreaView>
      ) : (
        <StatusBar
          backgroundColor={theme.PRIMARY} // Set status bar color on Android
          barStyle={theme.barStyle || 'light-content'} // Dynamic or fallback style
          // translucent={true} // Allow content to extend under status bar
        />
      )}
    </>
  );
};
const App = () => {
  const navigationRef = useRef(null);
  // const {deviceId} = useSelector(state => state?.Network);

  useEffect(() => {
    const unsubscribe = monitorNetworkStatus(Store.dispatch);
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <StatusBarWithTheme />
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator>
                <Stack.Screen
                  name="Splash"
                  component={Splash}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="ForgotPass"
                  component={ForgotPass}
                  options={{headerShown: false}}
                />
                {/* <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{headerShown: false}}
              /> */}
                {/* <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{headerShown: false}}
              /> */}
                <Stack.Screen
                  name="HomeDrawer"
                  component={HomeDrawer}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="AddDailyList"
                  component={AddDailyList}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="EditDailyList"
                  component={EditDailyList}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="CreateDailyList"
                  component={CreateDailyList}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="CreateAccount"
                  component={CreateAccount}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
              <NotificationInitializer navigationRef={navigationRef} />
            </NavigationContainer>
            <Toast
              config={toastConfig}
              position="top"
              topOffset={0}
              autoHide={true}
            />
          </ThemeProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
