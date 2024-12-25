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
    // console.log('theseParamsInsideScanServices', params);
    // let header = {
    //   Accept: 'multipart/form-data',
    //   'Content-Type': 'multipart/form-data',
    // };
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
};
