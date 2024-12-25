// src/redux/slices/networkSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {NETWORK_REDUCER} from '../SliceKey';
const initialState = {
  isConnected: true,
};

const NetworkSlice = createSlice({
  name: NETWORK_REDUCER,
  initialState,
  reducers: {
    setNetworkStatus: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const {setNetworkStatus} = NetworkSlice.actions;
const NetworkReducer = NetworkSlice.reducer;
export default NetworkReducer;
