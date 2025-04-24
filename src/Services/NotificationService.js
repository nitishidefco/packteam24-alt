import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {
  notification,
  setNotification,
} from '../Redux/Reducers/NotificationSlice';
import {Store} from '../Redux/Store';
import {fetchUnreadCountStart} from '../Redux/Reducers/MessageSlice';

// Functional notification service
const NotificationService = () => {
  let navigation = null;

  // Initialize the service
  const initialize = async navRef => {
    console.log('[NotificationService.initialize] Starting initialization', {
      navRef,
    });
    navigation = navRef;
    await requestPermissions();
    await setupNotifee();
    setupForegroundHandler();
    setupBackgroundHandler();
    setupTapHandler();

    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log(
        '[NotificationService.initialize] Initial notification found:',
        initialNotification,
      );
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
    console.log(
      '[NotificationService.requestPermissions] Requesting notification permissions',
    );
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log(
        '[NotificationService.requestPermissions] Permission status:',
        {authStatus, enabled},
      );
      if (enabled) {
        console.log(
          '[NotificationService.requestPermissions] Permissions granted, fetching FCM token',
        );
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
    console.log(
      '[NotificationService.sendFCMTokenToBackend] Sending FCM token to backend',
      {token},
    );
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
      console.log(
        '[NotificationService.sendFCMTokenToBackend] Form data prepared:',
        formData,
      );

      Store.dispatch(notification({payload: formData}));
      console.log(
        '[NotificationService.sendFCMTokenToBackend] Notification dispatched to store',
      );
    } catch (error) {
      console.error(
        '[NotificationService.sendFCMTokenToBackend] Error sending FCM token to backend:',
        error,
      );
    }
  };

  // Setup Notifee channels (required for Android)
  const setupNotifee = async () => {
    console.log(
      '[NotificationService.setupNotifee] Setting up Notifee channel',
    );
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      });
      console.log(
        '[NotificationService.setupNotifee] Notifee channel created successfully',
      );
    } catch (error) {
      console.error(
        '[NotificationService.setupNotifee] Error setting up Notifee channel:',
        error,
      );
    }
  };

  const setupForegroundHandler = () => {
    console.log(
      '[NotificationService.setupForegroundHandler] Setting up foreground message handler',
    );
    messaging().onMessage(async remoteMessage => {
      try {
        console.log(
          '[NotificationService.setupForegroundHandler] Foreground message received:',
          remoteMessage,
        );
        await displayNotification(remoteMessage);
        Store.dispatch(setNotification(remoteMessage));
        const state = Store.getState();
        const sessionId = state.Auth.data?.data?.sesssion_id;
        const deviceId = state.Network.deviceId;
        const globalLanguage = state.GlobalLanguage;
        const formData = new FormData();
        formData.append('session_id', sessionId);
        formData.append('device_id', deviceId);
        formData.append('lang', globalLanguage);
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
    console.log(
      '[NotificationService.setupBackgroundHandler] Setting up background message handler',
    );
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        console.log(
          '[NotificationService.setupBackgroundHandler] Background message received:',
          remoteMessage,
        );
        await displayNotification(remoteMessage);
        console.log(
          '[NotificationService.setupBackgroundHandler] Background notification displayed',
        );
      } catch (error) {
        console.error(
          '[NotificationService.setupBackgroundHandler] Error handling background message:',
          error,
        );
      }
    });
  };

  const setupTapHandler = () => {
    console.log(
      '[NotificationService.setupTapHandler] Setting up notification tap handlers',
    );

    // Handle foreground notification taps
    notifee.onForegroundEvent(({type, detail}) => {
      console.log(
        '[NotificationService.setupTapHandler] Foreground event received:',
        {type, detail},
      );
      if (type === 1) {
        console.log(
          '[NotificationService.setupTapHandler] Foreground notification tapped:',
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
          console.log(
            '[NotificationService.setupTapHandler] Initial message found:',
            remoteMessage,
          );
          handleNotificationPress(remoteMessage);
          Store.dispatch(setNotification(remoteMessage));
          console.log(
            '[NotificationService.setupTapHandler] Initial message processed and dispatched',
          );
        } else {
          console.log(
            '[NotificationService.setupTapHandler] No initial message found',
          );
        }
      });
  };

  const displayNotification = async remoteMessage => {
    console.log(
      '[NotificationService.displayNotification] Preparing to display notification:',
      remoteMessage,
    );
    try {
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
      console.log(
        '[NotificationService.displayNotification] Notification displayed successfully',
      );
    } catch (error) {
      console.error(
        '[NotificationService.displayNotification] Error displaying notification:',
        error,
      );
    }
  };

  const handleNotificationPress = notification => {
    console.log(
      '[NotificationService.handleNotificationPress] Handling notification press:',
      notification,
    );
    if (navigation && navigation.isReady()) {
      console.log(
        '[NotificationService.handleNotificationPress] Navigation ready, navigating to NotificationScreen',
      );
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
