import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import {useNotificationActions} from '../../Redux/Hooks/useNotificationActions';
import {useSelector} from 'react-redux';
import {useAuthActions} from '../../Redux/Hooks';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

const NotificationComponent = () => {
  const {notificationCall, notificationState} = useNotificationActions();
  const {deviceId} = useSelector(state => state?.Network);
  const {state} = useAuthActions();
  const {Auth} = state;

  console.log('notifcatin state', notificationState);

  // Define the session and user IDs
  const SessionId = Auth?.data?.data?.sesssion_id; // Typo: "sesssion_id" should be "session_id"
  const user_id = Auth?.data?.data?.user_id;

  // Create a channel for Android notifications
  useEffect(() => {
    const setupNotifeeChannel = async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH, // Ensures heads-up display
        vibration: true, // Optional: Adds vibration
        sound: 'default',
      });
    };
    setupNotifeeChannel();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async message => {
      console.log('Received FCM message:', message);

      try {
        if (message?.notification?.body) {
          await notifee.displayNotification({
            title: message.notification.title || 'No Title',
            body: message.notification.body,
            android: {
              channelId: 'default',
              smallIcon: 'ic_launcher',
              autoCancel: true,
              showTimestamp: true,
              pressAction: {id: 'default'},
              importance: AndroidImportance.LOW,
              actions: [
                {
                  title: 'Mark as Read',
                  pressAction: {id: 'read'},
                },
              ],
            },
          });
        } else {
          console.log('No notification body in message:', message);
        }
      } catch (error) {
        console.error('Error displaying notification:', error);
      }
    });
    return unsubscribe;
  }, []);

  // Handle background FCM messages
  messaging().setBackgroundMessageHandler(async message => {
    try {
      if (message?.notification?.body) {
        const notification = {
          title: message.notification.title || 'No Title',
          body: message.notification.body,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            actions: [
              {
                title: 'Mark as Read',
                pressAction: {id: 'read'},
              },
            ],
            pressAction: {
              id: 'default',
            },
          },
        };
        await notifee.displayNotification(notification);
      }
    } catch (error) {
      console.error('Background message error:', error);
    }
  });

  // Send FCM token to server
  useEffect(() => {
    const sendToken = async () => {
      try {
        console.log('Sending notification token');
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log('FCM Token:', token);

        const formData = new FormData();
        formData.append('fcm_token', token);
        formData.append('device_id', deviceId);
        formData.append('session_id', SessionId);
        formData.append('user_id', user_id);

        await notificationCall(formData);
        console.log('Token sent successfully');
      } catch (error) {
        console.error('Error sending token:', error);
      }
    };
    sendToken();
  }, [deviceId, SessionId, user_id, notificationCall]);

  // Local test notification with Notifee
  const sendLocalNotification = async () => {
    try {
      await notifee.displayNotification({
        title: 'Test Notification',
        body: 'This is a local test notification!',
        android: {
          channelId: 'default',
          actions: [
            {
              title: 'Mark as Read',
              pressAction: {id: 'read'},
            },
          ],
        },
      });
      console.log('Local notification sent');
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  return (
    <View>
      <Button title="Send Test Notification" onPress={sendLocalNotification} />
    </View>
  );
};

export default NotificationComponent;
