// src/redux/slices/networkSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {NETWORK_REDUCER} from '../SliceKey';
const initialState = {
  isConnected: true,
  deviceId: '',
  manufacturer: '',
  isNfcEnabled: null,
};

const NetworkSlice = createSlice({
  name: NETWORK_REDUCER,
  initialState,
  reducers: {
    setNetworkStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setDeviceInfo: (state, action) => {
      state.deviceId = action.payload.deviceId;
      state.manufacturer = action.payload.manufacturer;
    },
    setNfcStatus: (state, action) => {
      state.isNfcEnabled = action.payload;
    },
  },
});

export const {setNetworkStatus, setDeviceInfo, setNfcStatus} =
  NetworkSlice.actions;
const NetworkReducer = NetworkSlice.reducer;
export default NetworkReducer;
