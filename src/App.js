import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';
import {Provider} from 'react-redux';
import {Store} from './Redux/Store';
import Toast from 'react-native-toast-message';
import {toastConfig} from './Helpers';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {monitorNetworkStatus} from './Utlis/NetworkUtils';
import {reduxStorage} from './Redux/Storage';

// Screens
import Splash from './Splash';
import HomeDrawer from './Components/Common/HomeDrawer';
import Login from './Screens/Auth/Login';
import ForgotPass from './Screens/Auth/ForgotPass';
import ChangePassword from './Screens/UserHelp/ChangePassword';
import UserProfile from './Screens/UserHelp/UserProfile';
import CreateAccount from './Screens/Auth/CreateAccount';
import AddDailyList from './Screens/DailyList/AddDailyList';
import EditDailyList from './Screens/DailyList/EditDailyList';
import CreateDailyList from './Screens/DailyList/CreateDailyList';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
    <Stack.Screen name="ForgotPass" component={ForgotPass} options={{headerShown: false}} />
    <Stack.Screen name="CreateAccount" component={CreateAccount} options={{headerShown: false}} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="AddDailyList" component={AddDailyList} />
    <Stack.Screen name="EditDailyList" component={EditDailyList} />
    <Stack.Screen name="CreateDailyList" component={CreateDailyList} />
  </Stack.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await reduxStorage.getItem('token');
      setIsAuthenticated(!!token); // Convert token to boolean
    };

    checkAuth();
  }, []);

  // Check network status
  useEffect(() => {
    const unsubscribe = monitorNetworkStatus(Store.dispatch);
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            {isAuthenticated === null ? (
              <Splash />
            ) : isAuthenticated ? (
              <MainStack />
            ) : (
              <AuthStack />
            )}
          </NavigationContainer>
          <Toast config={toastConfig} position="top" topOffset={0} autoHide={true} />
        </I18nextProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
