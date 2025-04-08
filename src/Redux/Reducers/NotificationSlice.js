import {createSlice} from '@reduxjs/toolkit';
import {NOTIFICATION_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const notificationSlice = createSlice({
  name: NOTIFICATION_REDUCER,
  initialState: {
    data: null,
    isLoading: null,
  },
  reducers: {
    notification: state => {
      state.isLoading = true;
    },
    notificationSuccess: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    notificationFail: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const {notification, notificationSuccess, notificationFail} =
  notificationSlice.actions;

const NotificationReducer = notificationSlice.reducer;
export default NotificationReducer;
