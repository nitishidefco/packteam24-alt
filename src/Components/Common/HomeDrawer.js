// HomeDrawer.js

import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import Home from '../../Screens/Home/Home';
import CustomHeader from './CustomHeader';
import colors from '../../Config/AppStyling/colors';
import DailyListScreen from '../../Screens/DailyList/DailyListScreen';
import ChangePassword from '../../Screens/UserHelp/ChangePassword';
import UserProfile from '../../Screens/UserHelp/UserProfile';

const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,

        overlayColor: colors.TRANSPARENT,
        drawerStyle: {
          width: '60%',
        },
        sceneContainerStyle: {
          backgroundColor: '#061439',
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="DailyListScreen"
        component={DailyListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerShown: false,
        }}
      />

      {/* Add more drawer screens here */}
    </Drawer.Navigator>
  );
};

export default HomeDrawer;
