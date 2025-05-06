import {Platform} from 'react-native';

export default {
  //CONSTANT TO MANAGE DEVELOPING MODE AND ENDPOINT URL's

  // new url
  // https://eda.workflex360.de/

  // old url
  // https://das4you.mhcode.pl/

  IS_TESTDATA: '1',
  activeOpacity: 0.5,
  IS_DEVELOPING_MODE: true,
  KEY_APP_TOKEN: 'fcm_token',
  BASE_URL: {
    // DEV: 'https://test-tracker.workflex360.de/',
    DEV: 'https://edapackteam.visionvivante.in/',
    PROD: 'https://eda.workflex360.de/',
    // DEV: 'https://nfc.visionvivante.com/',
    // PROD: 'https://nfc.visionvivante.com/',
    IMAGEURL: 'https://das4you.mhcode.pl/storage/daily_list/attachment/',
  },
  ENVIRONMENT: {
    DEV: 'development',
    PROD: 'production',
  },
  ALERT_TYPE: {
    THANKS: 'thanks',
    NORMAL: 'normal',
  },
  USER_AGENT: Platform.OS === 'android' ? 'Android' : 'iOS',
  DEVICE_TYPE: Platform.OS === 'android' ? 1 : 0,
  REPORT_MAIL: 'support@test.com',
  NO_INTERNET_MESSAGE: 'No internet connection!!',
  USER_ROLE: {
    USER: 0,
    CHURCH: 1,
  },
  IMAGE_PICKER_TYPE: {
    AVATAR: 0,
    COVER: 1,
  },
  TOASTTYPE: {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    INFO: 'INFO',
  },
  LANGUAGES: {
    ENGLISH: {
      LABEL: 'English',
      CODE: 'en',
    },
    HINDI: {
      LABEL: 'Hindi',
      CODE: 'hi',
    },
  },
};
