import {toastMessage} from '../Helpers';
export const showNotificationAboutTagScannedWhileOffline = tagId => {
  switch (tagId) {
    case '53:AE:E6:BB:40:00:01':
      return toastMessage.success('Work Start');

    case '53:1E:3D:BC:40:00:01':
      return toastMessage.success('Break Start');

    case '53:88:66:BC:40:00:01':
      return toastMessage.success('Work End');

    default:
      break;
  }
};
