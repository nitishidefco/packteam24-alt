import {Alert} from 'react-native';
import {Constants} from '../../Config';
import {errorToast} from '../../Helpers/ToastMessage';
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
  const {dispatch, SessionId, deviceId, navigation} = getSessionHandler();

  const contentType = response.headers.get('Content-Type');

  if (response.status === 403 && !alertShown) {
    alertShown = true;
    return response.json().then(errorData => {
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
                console.log('logging out user');

                dispatch(getLogout(formData));
                navigation.replace('Login');
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

  // if (response.status !== 200) {

  //   return response.json().then(errorData => {
  //     errorToast(errorData.message);
  //     return Promise.reject(errorData);
  //   });
  // }

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
  POST,
  PUT,
  PATCH,
  GET,
  DELETE,
};
