import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../splash';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import HomeDrawer from '../Components/Common/HomeDrawer';
import Login from '../../src/Screens/Auth/Login';
import AddDailyList from '../Screens/DailyList/AddDailyList';
import EditDailyList from '../Screens/DailyList/EditDailyList';
import CreateDailyList from '../Screens/DailyList/CreateDailyList';
import {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {reduxStorage} from '../Redux/Storage';
const Stack = createStackNavigator();
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreAllLogs();

function UnAuthRoutes() {
  return (
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
    </Stack.Navigator>
  );
}

function AfterAuthRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
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
    </Stack.Navigator>
  );
}

export default function Navigator() {
  const [userToken, setuserToken] = useState(null);
  const getReduxState = async () => {
    let token = await reduxStorage.getItem('token');
    setuserToken(token);
  };
  useEffect(() => {
    getReduxState();
  }, [reduxStorage]);
  return (
    <NavigationContainer>
      {userToken != null || userToken != null ? (
        <AfterAuthRoutes />
      ) : (
        <AfterAuthRoutes />
      )}
    </NavigationContainer>
  );
}
