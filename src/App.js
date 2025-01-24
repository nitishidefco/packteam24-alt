// App.js

import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';

import Splash from './splash';

import HomeDrawer from './Components/Common/HomeDrawer';
import {Provider} from 'react-redux';
import {Store} from './Redux/Store';
import Login from './Screens/Auth/Login';
import Toast from 'react-native-toast-message';
import {toastConfig} from './Helpers';
import {LogBox} from 'react-native';
import AddDailyList from './Screens/DailyList/AddDailyList';
import EditDailyList from './Screens/DailyList/EditDailyList';
import CreateDailyList from './Screens/DailyList/CreateDailyList';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {monitorNetworkStatus} from './Utlis/NetworkUtils';
import ForgotPass from './Screens/Auth/ForgotPass';
import ChangePassword from './Screens/UserHelp/ChangePassword';
import UserProfile from './Screens/UserHelp/UserProfile';
import CreateAccount from './Screens/Auth/CreateAccount';

const Stack = createStackNavigator();
// LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreAllLogs();
// LogBox.ignoreAllLogs();
const App = () => {
  // check network status
  useEffect(() => {
    const unsubscribe = monitorNetworkStatus(Store.dispatch);
    //

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
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
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{headerShown: false}}
              />
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
          </NavigationContainer>
          <Toast
            config={toastConfig}
            position="top"
            topOffset={0}
            autoHide={true}
          />
        </I18nextProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
