import {Constants} from '../../Config';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

export default {
  WorkHistory: async params => {
    // console.log('API Call:', `${BASE_URL}api/today-work-history`);
    // console.log('Params:', params);
    return fetch(`${BASE_URL}api/today-work-history`, {
      method: 'POST',
      body: params,
      headers: {
        Accept: 'multipart/form-data',
        // 'Content-Type': "application/json"
      },
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
  GetRealTimeFromServer: async params => {
    return fetch(`${BASE_URL}api/current-time`, {
      method: 'POST',
      body: params,
      headers: {
        Accept: 'multipart/form-data',
        // 'Content-Type': "application/json"
      },
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
};
