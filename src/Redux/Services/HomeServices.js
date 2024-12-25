import {Constants} from '../../Config';
import {Tools} from '../../Helpers';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

export default {
  Home: params => {
    console.log('params', params);
    let header = {
      Accept: 'multipart/form-data',
    };
    console.log('Headerr', header);
    return fetch('https://eda.workflex360.de/api/dashboard', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
};
