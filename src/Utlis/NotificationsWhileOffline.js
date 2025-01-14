import {toastMessage} from '../Helpers';

export const showNotificationAboutTagScannedWhileOffline = validationResult => {

  if (validationResult.valid) {
    toastMessage.success(validationResult.message);
  } else {
    toastMessage.error(validationResult.message);
  }
};
