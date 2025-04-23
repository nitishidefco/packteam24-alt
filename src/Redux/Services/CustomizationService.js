import {Constants} from '../../Config';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

export default {
  GetCustomization: async params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch(`${BASE_URL}api/customization`, {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
};
