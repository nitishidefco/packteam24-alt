import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {
  notification,
  setNotification,
} from '../Redux/Reducers/NotificationSlice';
import {Store} from '../Redux/Store';
import {fetchUnreadCountStart} from '../Redux/Reducers/MessageSlice';
import {MMKV} from 'react-native-mmkv';
const storage = new MMKV();
const NotificationService = () => {
  let navigation = null;
  console.log('Inside notification service');

  const initialize = async navRef => {
    navigation = navRef;
    await requestPermissions();
    await setupNotifee(); // Added for Notifee channel setup
    let unsubscribeForeground; // Store unsubscribe function
    unsubscribeForeground = setupForegroundHandler();
    // setupBackgroundHandler();
    setupTapHandler();

    const initialNotification = await messaging().getInitialMessage();
    if (initialNotification) {
      handleNotificationPress(initialNotification);
    }
    console.log('[NotificationService.initialize] Initialization complete');
    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground(); // Clean up listener
        console.log(
          '[NotificationService.initialize] Cleaned up foreground handler',
        );
      }
    };
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
    try {
      let fcmToken = storage.getString('fcm_token');
      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          storage.set('fcm_token', fcmToken);
          console.log('New FCM Token:', fcmToken);
        } else {
          console.log('Failed to fetch FCM token');
          return;
        }
      }

      // Handle token refresh
      messaging().onTokenRefresh(async newToken => {
        console.log('FCM Token Refreshed:', newToken);
        storage.set('fcm_token', newToken);
        await sendFCMTokenToBackend(newToken);
      });

      await sendFCMTokenToBackend(fcmToken);
    } catch (error) {
      console.error('[NotificationService.getAndSendFCMToken] Error:', error);
    }
  };

  // Send FCM token to the backend
  const sendFCMTokenToBackend = async token => {
    const state = Store.getState();
    const deviceId = state?.Network?.deviceId;
    const authState = state?.Auth;
    const sessionId = authState?.data?.data?.sesssion_id;
    const userId = authState?.data?.data?.user_id;
    const globalLanguage = state.GlobalLanguage;

    if (!deviceId || !sessionId || !userId) {
      console.error(
        '[NotificationService.sendFCMTokenToBackend] Missing required fields:',
        {
          deviceId,
          sessionId,
          userId,
        },
      );  ``
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fcm_token', token);
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('user_id', userId);
      formData.append('lang', globalLanguage.globalLanguage);
      console.log('Sending FCM token to backend:');

      Store.dispatch(notification({payload: formData}));
    } catch (error) {
      console.error(
        '[NotificationService.sendFCMTokenToBackend] Error sending FCM token to backend:',
        error,
      );
    }
  };

  // Setup Notifee channel for Android
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

  // Handle foreground notifications
  const setupForegroundHandler = () => {
    console.log(
      '[NotificationService.setupForegroundHandler] Setting up foreground message handler',
    );
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        console.log(
          '[NotificationService.setupForegroundHandler] Foreground message received:',
          remoteMessage,
        );
        const messageId = remoteMessage.messageId;
        const storedMessageId = storage.getString('lastMessageId');
        if (storedMessageId === messageId) {
          console.log(
            '[NotificationService.setupForegroundHandler] Duplicate message ignored',
          );
          return;
        }
        storage.set('lastMessageId', messageId);
        await notifee.displayNotification({
          title: remoteMessage.notification?.title ?? 'New Notification',
          body: remoteMessage.notification?.body ?? 'You have a new message',
          data: remoteMessage.data || {},
          android: {
            channelId: 'default',
            pressAction: {
              id: 'default',
            },
            importance: AndroidImportance.HIGH,
          },
          ios: {
            sound: 'default',
            badgeCount: 1,
          },
        });
        // await displayNotification(remoteMessage);
        // // Store.dispatch(setNotification(remoteMessage));
        const state = Store.getState();
        const sessionId = state.Auth.data?.data?.sesssion_id;
        const deviceId = state.Network.deviceId;
        const globalLanguage = state.GlobalLanguage;
        const formData = new FormData();
        formData.append('session_id', sessionId);
        formData.append('device_id', deviceId);
        formData.append('lang', globalLanguage.globalLanguage);
        formData.append('page', 1);
        console.log('Fetching uread count');

        Store.dispatch(fetchUnreadCountStart({payload: formData}));
      } catch (error) {
        console.error(
          '[NotificationService.setupForegroundHandler] Error handling foreground message:',
          error,
        );
      }
    });
    return unsubscribe;
  };

  // // Handle background notifications
  // const setupBackgroundHandler = () => {
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('[NotificationService.setupBackgroundHandler] Background message received:', remoteMessage);
  //     try {
  //       Store.dispatch(setNotification(remoteMessage));
  //     } catch (error) {
  //       console.error('[NotificationService.setupBackgroundHandler] Error handling background message:', error);
  //     }
  //   });
  // };

  // Handle notification taps (foreground, background, killed)
  const setupTapHandler = () => {
    // Handle tap in foreground/background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '[NotificationService.setupTapHandler] Notification opened:',
        remoteMessage,
      );
      if (remoteMessage) {
        handleNotificationPress(remoteMessage);
        Store.dispatch(setNotification(remoteMessage));
      }
    });

    // Handle tap from killed state
    messaging()
      .getInitialMessage()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '[NotificationService.setupTapHandler] Initial message from killed state:',
            remoteMessage,
          );
          handleNotificationPress(remoteMessage);
          Store.dispatch(setNotification(remoteMessage));
        } else {
          console.log(
            '[NotificationService.setupTapHandler] No initial message found',
          );
        }
      });
  };

  // Display local notification using Notifee (for foreground only)
  const displayNotification = async remoteMessage => {
    try {
      console.log(
        '[NotificationService.displayNotification] Displaying foreground notification:',
        remoteMessage,
      );

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

  // Navigate to NotificationScreen on tap
  const handleNotificationPress = remoteMessage => {
    if (navigation && navigation.isReady()) {
      console.log(
        '[NotificationService.handleNotificationPress] Navigating to NotificationScreen',
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

export default NotificationService;
