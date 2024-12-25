// --------------- LIBRARIES ---------------
import {Platform, PermissionsAndroid} from 'react-native';

/**
 * Ask for permission and display dialog in Android
 * @param {Permission} permission - Android permission object
 * @param {Object} rational - Object with title, message, buttonPositive, buttonNegative for rational alert
 */
const request = async (permission, rational) => {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }

  try {
    let granted = false;
    if (rational) {
      granted = await PermissionsAndroid.request(permission, rational);
    } else {
      granted = await PermissionsAndroid.request(permission);
    }
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  } catch (err) {
    return Promise.reject(false);
  }
};

export default {
  request,
};
