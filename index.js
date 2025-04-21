/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';
import NotificationService from './src/Services/NotificationService';
notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('Background event:', {type, detail});
  if (type === notifee.EventType.PRESS) {
    // Delegate to NotificationService for handling
    NotificationService.handleBackgroundNotification(detail.notification);
  }
});
AppRegistry.registerComponent(appName, () => App);
