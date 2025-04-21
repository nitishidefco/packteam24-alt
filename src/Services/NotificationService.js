// src/Services/NotificationService.js
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
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
    console.log(navRef);
    navigation = navRef;
    await requestPermissions();
    await setupNotifee();
    setupForegroundHandler();
    setupBackgroundHandler();
    setupTapHandler();

    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      handleNotificationPress(initialNotification);
    } else {
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
        await getAndSendFCMToken();
      } else {
      }
    } catch (error) {}
  };

  // Retrieve FCM token and send it to the backend
  const getAndSendFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      await sendFCMTokenToBackend(token);
    } catch (error) {
      console.error('Step 15: Error retrieving FCM token:', error);
    }
  };

  // Send FCM token to the backend
  const sendFCMTokenToBackend = async token => {
    const state = Store.getState();
    const deviceId = state?.Network?.deviceId;
    const authState = state?.Auth;
    const sessionId = authState?.data?.data?.sesssion_id;
    const userId = authState?.data?.data?.user_id;

    // Validate the required fields
    if (!deviceId || !sessionId || !userId) {
      console.error('Step 18: Missing required fields:', {
        deviceId,
        sessionId,
        userId,
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('fcm_token', token);
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('user_id', userId);

      Store.dispatch(notification({payload: formData}));
    } catch (error) {
      console.error('Step 21: Error sending FCM token to backend:', error);
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
    } catch (error) {
      console.error('Step 24: Error setting up Notifee:', error);
    }
  };

  const setupForegroundHandler = () => {
    messaging().onMessage(async remoteMessage => {
      try {
        await displayNotification(remoteMessage);

        Store.dispatch(setNotification(remoteMessage));
      } catch (error) {
        console.error('Step 28: Error handling foreground message:', error);
      }
    });
  };

  const setupBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        await displayNotification(remoteMessage);
      } catch (error) {
        console.error('Step 31: Error handling background message:', error);
      }
    });
  };

  const setupTapHandler = () => {
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === 'press') {
        handleNotificationPress(detail.notification);
      }
    });

    // Handle Firebase background tap events (app in background)
    notifee.onBackgroundEvent(async ({type, detail}) => {
      console.log('Step 35: Background event type:', type);
      console.log('Step 36: Background event details:', detail);
      if (type === 3) {
        console.log('Step 37: Background/Quit notification tapped:', detail.notification);
        if (navigation) {
          console.log('Step 38: Navigation available, handling notification press');
          handleNotificationPress(detail.notification);
        } else {
          console.log('Step 38: Navigation not available, pending notification');
          // pendingNotification = detail.notification;
        }
      }
    });

    messaging()
      .getInitialMessage()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('INside get initial message');

          handleNotificationPress(remoteMessage);
          Store.dispatch(setNotification(remoteMessage));
        } else {
          console.log('Step 40: No initial message found');
        }
      });
  };

  const displayNotification = async remoteMessage => {
    console.log(
      'Step 43: Displaying notification for remote message:',
      remoteMessage,
    );
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
          importance: AndroidImportance.HIGH,
        },
      });
    } catch (error) {
      console.error('Step 45: Error displaying notification:', error);
    }
  };

  const handleNotificationPress = () => {
    if (navigation) {
      console.log('Step 47: Navigating to NotificationScreen');
      navigation.navigate('HomeDrawer', {screen: 'NotificationScreen'});
    } else {
      console.log('Step 47: Navigation not available');
    }
  };

  return {initialize};
};

// Export a singleton instance
export default NotificationService();
