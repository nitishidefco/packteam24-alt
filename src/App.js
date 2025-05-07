if (__DEV__) {
  require('../ReactotronConfig');
}

import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n/i18n';
import {Provider} from 'react-redux';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Store} from './Redux/Store';
import Toast from 'react-native-toast-message';
import {toastConfig} from './Helpers';
import {monitorNetworkStatus} from './Utlis/NetworkUtils';
import Splash from './splash';
import HomeDrawer from './Components/Common/HomeDrawer';
import Login from './Screens/Auth/Login';
import ForgotPass from './Screens/Auth/ForgotPass';
import CreateAccount from './Screens/Auth/CreateAccount';
import AddDailyList from './Screens/DailyList/AddDailyList';
import EditDailyList from './Screens/DailyList/EditDailyList';
import CreateDailyList from './Screens/DailyList/CreateDailyList';
import NotificationInitializer from './Components/HomeComponent/NotificationInitializer';
import {ThemeProvider, useTheme} from './Context/ThemeContext';
import {Platform, StatusBar} from 'react-native';

const Stack = createStackNavigator();

// List of auth screens that should have transparent status bars
const AUTH_SCREENS = ['Login', 'CreateAccount', 'ForgotPass', 'ResetPassword'];

const DynamicStatusBar = ({currentScreen}) => {
  const theme = useTheme();

  // Check if current screen is an auth screen
  const isAuthScreen = AUTH_SCREENS.includes(currentScreen);

  if (isAuthScreen) {
    // Use transparent status bar for auth screens
    return (
      <>
        {Platform.OS === 'ios' ? (
          <SafeAreaView
            style={{
              backgroundColor: 'transparent',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
            edges={['top']}>
            <StatusBar barStyle="dark-content" />
          </SafeAreaView>
        ) : (
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
            translucent={true}
          />
        )}
      </>
    );
  } else {
    // Use theme.PRIMARY for all other screens
    return (
      <>
        {Platform.OS === 'ios' ? (
          <SafeAreaView
            style={{
              backgroundColor: theme.PRIMARY || '#800080',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            }}
            edges={['top']}>
            <StatusBar barStyle="light-content" />
          </SafeAreaView>
        ) : (
          <StatusBar
            backgroundColor={theme.PRIMARY || '#800080'}
            barStyle="light-content"
            translucent={false}
          />
        )}
      </>
    );
  }
};

const App = () => {
  const navigationRef = useRef(null);
  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = monitorNetworkStatus(Store.dispatch);
    return () => unsubscribe();
  }, []);

  // Get the active route name from the navigation state
  const getActiveRouteName = state => {
    if (!state) return null;
    const route = state.routes[state.index];
    if (!route) return null;

    // Drill down to get the innermost active route
    if (route.state) {
      return getActiveRouteName(route.state);
    }

    return route.name;
  };

  // Update current route on navigation state change
  const handleNavigationStateChange = state => {
    const routeName = getActiveRouteName(state);
    if (routeName) {
      setCurrentRoute(routeName);
    }
  };

  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <DynamicStatusBar currentScreen={currentRoute} />
            <NavigationContainer
              ref={navigationRef}
              onStateChange={handleNavigationStateChange}
              onReady={() => {
                const initialState = navigationRef.current?.getRootState();
                const initialRoute = getActiveRouteName(initialState);
                if (initialRoute) {
                  setCurrentRoute(initialRoute);
                } else {
                  setCurrentRoute('Splash');
                }
              }}>
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
                  name="CreateAccount"
                  component={CreateAccount}
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
                {/* Add ResetPassword screen if it's not already in your navigator */}
                {/* <Stack.Screen
                  name="ResetPassword"
                  component={ResetPassword}
                  options={{headerShown: false}}
                /> */}
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
