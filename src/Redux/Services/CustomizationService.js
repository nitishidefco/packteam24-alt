import {Constants} from '../../Config';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

export default {
  GetCustomization: async () => {
    return fetch(`${BASE_URL}api/app-personalization-data`, {
      method: 'GET',
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
};
