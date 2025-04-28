import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {
  notification,
  setNotification,
} from '../Redux/Reducers/NotificationSlice';
import {Store} from '../Redux/Store';
import {fetchUnreadCountStart} from '../Redux/Reducers/MessageSlice';
const NotificationService = () => {
  let navigation = null;
  const initialize = async navRef => {
    navigation = navRef;
    await requestPermissions();
    await setupNotifee();
    setupForegroundHandler();
    setupBackgroundHandler();
    setupTapHandler();

    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      handleNotificationPress(initialNotification.notification);
    } else {
      console.log(
        '[NotificationService.initialize] No initial notification found',
      );
    }
    console.log('[NotificationService.initialize] Initialization complete');
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
        console.log(
          '[NotificationService.requestPermissions] Permissions denied',
        );
      }
    } catch (error) {
      console.error(
        '[NotificationService.requestPermissions] Error requesting permissions:',
        error,
      );
    }
  };

  // Retrieve FCM token and send it to the backend
  const getAndSendFCMToken = async () => {
    console.log(
      '[NotificationService.getAndSendFCMToken] Retrieving FCM token',
    );
    try {
      const token = await messaging().getToken();
      console.log(
        '[NotificationService.getAndSendFCMToken] FCM token retrieved:',
        token,
      );
      await sendFCMTokenToBackend(token);
      console.log(
        '[NotificationService.getAndSendFCMToken] FCM token sent to backend',
      );
    } catch (error) {
      console.error(
        '[NotificationService.getAndSendFCMToken] Error retrieving FCM token:',
        error,
      );
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
      console.error(
        '[NotificationService.sendFCMTokenToBackend] Missing required fields:',
        {
          deviceId,
          sessionId,
          userId,
        },
      );
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
      console.error(
        '[NotificationService.sendFCMTokenToBackend] Error sending FCM token to backend:',
        error,
      );
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
      console.error(
        '[NotificationService.setupNotifee] Error setting up Notifee channel:',
        error,
      );
    }
  };

  const setupForegroundHandler = () => {
    messaging().onMessage(async remoteMessage => {
      try {
        await displayNotification(remoteMessage);
        Store.dispatch(setNotification(remoteMessage));
        const state = Store.getState();
        const sessionId = state.Auth.data?.data?.sesssion_id;
        const deviceId = state.Network.deviceId;
        const globalLanguage = state.GlobalLanguage;
        const formData = new FormData();
        formData.append('session_id', sessionId);
        formData.append('device_id', deviceId);
        formData.append('lang', globalLanguage.globalLanguage);
        formData.append('page', 1);

        Store.dispatch(fetchUnreadCountStart({payload: formData}));
      } catch (error) {
        console.error(
          '[NotificationService.setupForegroundHandler] Error handling foreground message:',
          error,
        );
      }
    });
  };

  const setupBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background handler called');

      try {
        await displayNotification(remoteMessage);
      } catch (error) {
        console.error(
          '[NotificationService.setupBackgroundHandler] Error handling background message:',
          error,
        );
      }
    });
  };

  const setupTapHandler = () => {
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === 1) {
        handleNotificationPress(detail.notification);
      }
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      console.log('[NotificationService.onBackgroundEvent] Background event:', {
        type,
        detail,
      });
      if (type === EventType.PRESS) {
        console.log(
          '[NotificationService.onBackgroundEvent] Background notification pressed:',
          detail.notification,
        );
        handleNotificationPress(detail.notification);
      }
    });
    // Handle Firebase initial message (app opened from killed state)
    messaging()
      .getInitialMessage()
      .then(remoteMessage => {
        if (remoteMessage) {
          handleNotificationPress(remoteMessage);
          Store.dispatch(setNotification(remoteMessage));
        } else {
          console.log(
            '[NotificationService.setupTapHandler] No initial message found',
          );
        }
      });
  };

  const displayNotification = async remoteMessage => {
    try {
      console.log('Calling Display Notification');
      await notifee.displayNotification({
        title:
          remoteMessage.notification?.title ??
          remoteMessage.data?.title ??
          'New Notification',
        body:
          remoteMessage.notification?.body ??
          remoteMessage.data?.body ??
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
      console.error(
        '[NotificationService.displayNotification] Error displaying notification:',
        error,
      );
    }
  };

  const handleNotificationPress = notification => {
    if (navigation && navigation.isReady()) {
      navigation.navigate('HomeDrawer', {screen: 'NotificationScreen'});
    } else {
      console.log(
        '[NotificationService.handleNotificationPress] Navigation not ready or unavailable',
      );
    }
  };

  return {initialize};
};

// Export a singleton instance
export default NotificationService();
