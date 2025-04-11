// src/Services/NotificationService.js
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {
  notification,
  setNotification,
} from '../Redux/Reducers/NotificationSlice';
import {Store} from '../Redux/Store';

// Functional notification service
const NotificationService = () => {
  let navigation = null;
  // Initialize the service
  const initialize = async navRef => {
    navigation = navRef;
    await requestPermissions();
    await setupNotifee();
    setupForegroundHandler();
    setupBackgroundHandler();
    setupTapHandler();

    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log('Initial notification:', initialNotification);
      handleNotificationPress(initialNotification);
    }
  };

  // Request permissions for notifications
  const requestPermissions = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
        await getAndSendFCMToken();
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  // Retrieve FCM token and send it to the backend
  const getAndSendFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      await sendFCMTokenToBackend(token);
    } catch (error) {
      console.error('Error retrieving FCM token:', error);
    }
  };

  // Send FCM token to the backend
  const sendFCMTokenToBackend = async token => {
    const state = Store.getState();
    const deviceId = state?.Network?.deviceId;
    const authState = state?.Auth; // Adjust based on your reducer name
    const sessionId = authState?.data?.data?.sesssion_id;
    const userId = authState?.data?.data?.user_id;

    // Validate the required fields
    if (!deviceId || !sessionId || !userId) {
      console.error('Missing required fields:', {deviceId, sessionId, userId});
      return;
    }
    try {
      const formData = new FormData();
      formData.append('fcm_token', token);
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('user_id', userId);
      Store.dispatch(notification({payload: formData}));
      console.log('FCM token sent to backend successfully');
    } catch (error) {
      console.error('Error sending FCM token to backend:', error);
    }
  };

  // Setup Notifee channels (required for Android)
  const setupNotifee = async () => {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      });
      console.log('Notifee default channel created');
    } catch (error) {
      console.error('Error setting up Notifee:', error);
    }
  };
  const setupForegroundHandler = () => {
    messaging().onMessage(async remoteMessage => {
      try {
        console.log('Foreground message received:', remoteMessage);
        await displayNotification(remoteMessage);
        // Store the notification in Redux for UI updates (e.g., unread count)
        Store.dispatch(setNotification(remoteMessage));
      } catch (error) {
        console.error('Error handling foreground message:', error);
      }
    });
  };
  const setupBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        console.log('Background message received:', remoteMessage);
        await displayNotification(remoteMessage);
      } catch (error) {
        console.error('Error handling background message:', error);
      }
    });
  };
  const setupTapHandler = () => {
    // Handle Notifee foreground tap events
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === 'press') {
        console.log('Foreground notification tapped:', detail.notification);
        handleNotificationPress(detail.notification);
      }
    });

    // Handle Firebase background tap events (app in background)
    //     notifee.onBackgroundEvent(async ({type, detail}) => {
    //       console.log('Background event type:', type);
    //       console.log('Background event details:', detail);
    //       if (type === 1) {
    //         // EventType.PRESS = 1
    //         console.log(
    //           'Background/Quit notification tapped:',
    //           detail.notification,
    //         );
    //         if (navigation) {
    //           console.log('Inside navigation');

    //           handleNotificationPress(detail.notification);
    //         } else {
    //           console.log('OPending navigation');

    //           pendingNotification = detail.notification; // Store if navigation isn’t ready
    //         }
    //       }
    //     });

    messaging()
      .getInitialMessage()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Quit state notification tapped:', remoteMessage);
          console.log('Navigation ref available:', navigation ? 'Yes' : 'No');
          handleNotificationPress(remoteMessage);
          Store.dispatch(setNotification(remoteMessage));
        }
      });
  };

  const displayNotification = async remoteMessage => {
    console.log('Remote message', remoteMessage);

    try {
      await notifee.displayNotification({
        title:
          remoteMessage.data.title ??
          remoteMessage.notification?.title ??
          'New Notification',
        body:
          remoteMessage.data.body ??
          remoteMessage.notification?.body ??
          'You have a new message',
        data: remoteMessage.data || {},
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  };

  const handleNotificationPress = notification => {
    // Always navigate to NotificationScreen inside HomeDrawer
    if (navigation) {
      console.log('Navigating to NotificationScreen');
      navigation.navigate('HomeDrawer', {screen: 'NotificationScreen'});
    }
  };

  return {initialize};
};

// Export a singleton instance
export default NotificationService();
