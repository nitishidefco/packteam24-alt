import {Alert} from 'react-native';
import {Constants} from '../../Config';
import {Tools} from '../../Helpers';
import Ajax from './base';
import {error, info} from '../../Helpers/ToastMessage';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

export default {
  ScanTag: async params => {
    return fetch(`${BASE_URL}api/work-time/update`, {
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

  WorkStatus: async params => {
    return fetch(`${BASE_URL}api/my-status`, {
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

  AllNFCTags: async params => {
    return fetch(`${BASE_URL}api/nfc-tags`, {
      method: 'POST',
      body: params,
      headers: {
        Accept: 'multipart/form-data',
      },
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => data.data[0]);
  },
};
