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
import NotificationScreen from '../../Screens/Home/NotificationScreen';
import ArchiveScreen from '../../Screens/Home/ArchiveScreen';
import {COLOR} from '../../Config/AppStyling';

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
          backgroundColor: COLOR.PURPLE,
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
      <Drawer.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ArchiveScreen"
        component={ArchiveScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* Add more drawer screens here */}
    </Drawer.Navigator>
  );
};

export default HomeDrawer;
