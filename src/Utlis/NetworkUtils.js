// src/utils/networkUtils.js
import NetInfo from '@react-native-community/netinfo';
import {setNetworkStatus} from '../Redux/Reducers/NetworkSlice';

export const monitorNetworkStatus = dispatch => {
  const unsubscribe = NetInfo.addEventListener(state => {
    const isConnected = state.isConnected;
    dispatch(setNetworkStatus(isConnected));
  });

  return unsubscribe;
};
