import {Constants} from '../../Config';
import {Tools} from '../../Helpers';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;
console.log('Base url', BASE_URL);

export default {
  Login: async params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch(`${BASE_URL}api/login`, {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
  Logout: async params => {
    let header = {
      Accept: 'multipart/form-data',
    };

    return fetch(`${BASE_URL}api/logout`, {
      method: 'POST',
      body: params,
    })
      .then(response => response)
      .then(data => {
        return data;
      });
  },

  ForgotPassword: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch(`${BASE_URL}api/forgot-pass`, {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
  CreateAccount: async params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch(`${BASE_URL}api/register`, {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
};
