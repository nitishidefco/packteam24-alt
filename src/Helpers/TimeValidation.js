import moment from 'moment-timezone';
import {Alert} from 'react-native';

const checkDeviceTime = realTime => {
  const serverMoment = moment.tz(
    realTime,
    'YYYY-MM-DD HH:mm:ss',
    'Europe/Berlin',
  );
  const deviceMoment = moment.tz('Europe/Berlin');

  if (deviceMoment.isBefore(serverMoment) || !realTime) {
    Alert.alert(
      'Time Synchronization Error',
      "Your device's time is set earlier than the server time, which is not allowed. This discrepancy suggests your device time may have been manually altered. To ensure accurate functionality and security, please enable automatic date and time settings in your device:\n\n" +
        '- Go to Settings > Date & Time\n' +
        "- Enable 'Automatic date and time' (or 'Set time automatically')\n\n" +
        'The app will not function until this is corrected.',
      [
        {
          text: 'OK',
          onPress: () => console.log('User acknowledged the alert'),
          style: 'default',
        },
      ],
      {cancelable: false},
    );
    return false;
  } else {
    console.log('Device time is synchronized or ahead of server time.');
    return true;
  }
};

export default checkDeviceTime;
