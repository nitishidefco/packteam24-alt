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
    console.log(
      'Step 1: Initializing NotificationService with navRef:',
      navRef,
    );
    navigation = navRef;
    console.log('Step 2: Requesting permissions');
    await requestPermissions();
    console.log('Step 3: Setting up Notifee');
    await setupNotifee();
    console.log('Step 4: Setting up foreground handler');
    setupForegroundHandler();
    console.log('Step 5: Setting up background handler');
    setupBackgroundHandler();
    console.log('Step 6: Setting up tap handler');
    setupTapHandler();

    console.log('Step 7: Checking for initial notification');
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log('Step 8: Initial notification found:', initialNotification);
      handleNotificationPress(initialNotification);
    } else {
      console.log('Step 8: No initial notification found');
    }
  };

  // Request permissions for notifications
  const requestPermissions = async () => {
    try {
      console.log('Step 9: Requesting notification permissions');
      const authStatus = await messaging().requestPermission();
      console.log('Step 10: Notification permission status:', authStatus);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Step 11: Notification permission granted');
        await getAndSendFCMToken();
      } else {
        console.log('Step 11: Notification permission denied');
      }
    } catch (error) {
      console.error('Step 12: Error requesting permissions:', error);
    }
  };

  // Retrieve FCM token and send it to the backend
  const getAndSendFCMToken = async () => {
    try {
      console.log('Step 13: Retrieving FCM token');
      const token = await messaging().getToken();
      console.log('Step 14: FCM Token retrieved:', token);
      await sendFCMTokenToBackend(token);
    } catch (error) {
      console.error('Step 15: Error retrieving FCM token:', error);
    }
  };

  // Send FCM token to the backend
  const sendFCMTokenToBackend = async token => {
    console.log('Step 16: Sending FCM token to backend');
    const state = Store.getState();
    const deviceId = state?.Network?.deviceId;
    const authState = state?.Auth;
    const sessionId = authState?.data?.data?.sesssion_id;
    const userId = authState?.data?.data?.user_id;

    console.log('Step 17: Retrieved state for FCM token:', {
      deviceId,
      sessionId,
      userId,
    });

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
      console.log(
        'Step 19: Dispatching notification action with formData:',
        formData,
      );
      Store.dispatch(notification({payload: formData}));
      console.log('Step 20: FCM token sent to backend successfully');
    } catch (error) {
      console.error('Step 21: Error sending FCM token to backend:', error);
    }
  };

  // Setup Notifee channels (required for Android)
  const setupNotifee = async () => {
    try {
      console.log('Step 22: Creating Notifee default channel');
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      });
      console.log('Step 23: Notifee default channel created successfully');
    } catch (error) {
      console.error('Step 24: Error setting up Notifee:', error);
    }
  };

  const setupForegroundHandler = () => {
    console.log('Step 25: Setting up foreground message handler');
    messaging().onMessage(async remoteMessage => {
      try {
        console.log('Step 26: Foreground message received:', remoteMessage);
        await displayNotification(remoteMessage);
        console.log(
          'Step 27: Dispatching setNotification action with remoteMessage:',
          remoteMessage,
        );
        Store.dispatch(setNotification(remoteMessage));
      } catch (error) {
        console.error('Step 28: Error handling foreground message:', error);
      }
    });
  };

  const setupBackgroundHandler = () => {
    console.log('Step 29: Setting up background message handler');
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        console.log('Step 30: Background message received:', remoteMessage);
        await displayNotification(remoteMessage);
      } catch (error) {
        console.error('Step 31: Error handling background message:', error);
      }
    });
  };

  const setupTapHandler = () => {
    console.log('Step 32: Setting up tap handlers');
    // Handle Notifee foreground tap events
    console.log('Step 33: Setting up Notifee foreground event handler');
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === 'press') {
        console.log(
          'Step 34: Foreground notification tapped:',
          detail.notification,
        );
        handleNotificationPress(detail.notification);
      }
    });

    // Handle Firebase background tap events (app in background)
    // notifee.onBackgroundEvent(async ({type, detail}) => {
    //   console.log('Step 35: Background event type:', type);
    //   console.log('Step 36: Background event details:', detail);
    //   if (type === 1) {
    //     console.log('Step 37: Background/Quit notification tapped:', detail.notification);
    //     if (navigation) {
    //       console.log('Step 38: Navigation available, handling notification press');
    //       handleNotificationPress(detail.notification);
    //     } else {
    //       console.log('Step 38: Navigation not available, pending notification');
    //       pendingNotification = detail.notification;
    //     }
    //   }
    // });

    console.log('Step 39: Checking for initial message from Firebase');
    messaging()
      .getInitialMessage()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Step 40: Quit state notification tapped:',
            remoteMessage,
          );
          console.log(
            'Step 41: Navigation ref available:',
            navigation ? 'Yes' : 'No',
          );
          handleNotificationPress(remoteMessage);
          console.log(
            'Step 42: Dispatching setNotification action for initial message:',
            remoteMessage,
          );
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
        },
      });
      console.log('Step 44: Notification displayed successfully');
    } catch (error) {
      console.error('Step 45: Error displaying notification:', error);
    }
  };

  const handleNotificationPress = () => {
    console.log('Step 46: Handling notification press');
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
