import {Constants} from '../../Config';
import {Tools} from '../../Helpers';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;
export default {
  SendToken: async params => {
    return fetch(`${BASE_URL}api/save-fcm-token`, {
      method: 'POST',
      body: params,
      headers: {
        Accept: 'multipart/form-data',
      },
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
};
