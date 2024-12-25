import {Alert} from 'react-native';
import {Constants} from '../../Config';
import {error, info} from '../../Helpers/ToastMessage';

const POST = 'post';
const GET = 'get';
const PUT = 'put';
const PATCH = 'patch';
const DELETE = 'delete';

const handleResponse = response => {
  const contentType = response.headers.get('Content-Type');
  console.log('responseseesss', response);
  console.log('CT', contentType);

  if (response.status !== 200) {
    return response.json().then(errorData => {
      // Alert.alert(
      //   'Request failed',
      //   `Message: ${errorData?.errors?.auth || 'Unknown error'}`,
      // );
      // error(errorData)
      console.log('Error response:', errorData);
      return Promise.reject(errorData);
    });
  }

  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json().then(jsonData => {
      console.log('inside json block', jsonData);

      // Alert.alert(
      //   'Request Success',
      //   `Message: ${jsonData?.errors?.nfc_key || 'Unknown error'}`,
      // );

      // info(jsonData);
      return jsonData;
    });
  } else {
    return response.text().then(textData => {
      console.log('inside else block', textData);
      // Alert.alert(
      //   'Request Success text',
      //   `Message: ${textData?.errors?.nfc_key || 'Unknown error'}`,
      // );

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

  console.log('Request Config:', config);
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
