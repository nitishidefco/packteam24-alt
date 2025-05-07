// Modified handleResponse function with i18n language debugging
import {Alert} from 'react-native';
import {Constants} from '../../Config';
import {getSessionHandler} from '../../Utlis/SessionHandler';
import {getLogout} from '../Reducers/AuthSlice';
import i18n from '../../i18n/i18n';

const POST = 'post';
const GET = 'get';
const PUT = 'put';
const PATCH = 'patch';
const DELETE = 'delete';

let alertShown = false;
const handleResponse = response => {
  const {dispatch, SessionId, deviceId, navigation, globalLanguage} =
    getSessionHandler();
  
  console.log('Global language:', globalLanguage);
  console.log('Current i18n language:', i18n.language);
  console.log('Available i18n languages:', i18n.languages);
  console.log('i18n initialized:', i18n.isInitialized);
  console.log('Session.SE translation:', i18n.t('Session.SE'));

  const contentType = response.headers.get('Content-Type');

  if (response.status === 403 && !alertShown) {
    alertShown = true;
    console.log('Alert is shown', response);

    // Force language to match globalLanguage before showing alert
    if (globalLanguage && globalLanguage.globalLanguage && i18n.language !== globalLanguage.globalLanguage) {
      console.log(`Changing i18n language from ${i18n.language} to ${globalLanguage.globalLanguage}`);
      i18n.changeLanguage(globalLanguage.globalLanguage);
    }

    return response.json().then(errorData => {
      // Double-check the translation after potential language change
      console.log('Final Session.SE translation:', i18n.t('Session.SE'));
      
      Alert.alert(
        i18n.t('Session.SE'),
        errorData.message || 'You have been logged out.',
        [
          {
            text: 'OK',
            onPress: () => {
              try {
                const formData = new FormData();
                formData.append('session_id', SessionId);
                formData.append('device_id', deviceId);

                dispatch(getLogout(formData));
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
                alertShown = false;
              } catch (error) {
                console.error('Error logging out:', error);
                // Handle error appropriately, e.g., show an alert to the user
              }
            },
          },
        ],
      );
      return Promise.reject(errorData);
    });
  }

  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json().then(jsonData => {
      return jsonData;
    });
  } else {
    return response.text().then(textData => {
      return textData;
    });
  }
};

// Add a debugging function to check i18n state
const debugI18n = () => {
  return {
    currentLanguage: i18n.language,
    isInitialized: i18n.isInitialized,
    availableLanguages: i18n.languages,
    sessionExpiredText: i18n.t('Session.SE'),
    defaultLanguage: i18n.options.fallbackLng,
    detectedLanguage: i18n.options.detection ? i18n.options.detection.order : 'Not configured'
  };
};

const Request = async (route, method, payload, formData, priv = true) => {
  let config = priv
    ? {
        method: method,
        headers: {
          Accept: 'application/json',
          'x-access-token': global.accesskey,
          guid: global.guid,
          device_type: Constants.DEVICE_TYPE,
        },
      }
    : {
        method: method,
        headers: {
          Accept: 'application/json',
          accesskey: 'nousername',
          secretkey: global.secretkey,
          device_type: Constants.DEVICE_TYPE,
        },
      };
  if (payload) {
    config = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
  }
  if (formData) {
    config = {
      ...config,
      body: formData,
    };
  }

  return fetch(route, config).then(res => handleResponse(res));
};

export default {
  Request,
  handleResponse,
  debugI18n,
  POST,
  PUT,
  PATCH,
  GET,
  DELETE,
};