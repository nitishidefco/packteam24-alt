import { createSlice } from '@reduxjs/toolkit';
import { NOTIFICATION_REDUCER } from '../SliceKey';

const notificationSlice = createSlice({
  name: NOTIFICATION_REDUCER,
  initialState: {
    data: null,
    isLoading: null,
    notifications: [],
    unreadCount: 0,
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
    setNotification: (state, action) => {
      state.notifications.push(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  notification,
  notificationSuccess,
  notificationFail,
  setNotification,
  clearNotifications,
  setPermissionAlertShown,
  resetPermissionAlert,
} = notificationSlice.actions;

const NotificationReducer = notificationSlice.reducer;
export default NotificationReducer;
