import {Constants} from '../../Config';
import Ajax from './base';

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
  BulkUpdate: async params => {
    try {
      const response = await fetch(`${BASE_URL}api/work-time/update-bulk`, {
        method: 'POST',
        body: params,
      });
      const responseText = await response.text();

      if (!response.ok) {
        console.error('Error response:', responseText);
        return {
          success: false,
          message: `Error: ${response.status} - ${responseText}`,
        };
      }

      // Parse the response as JSON
      const responseBody = JSON.parse(responseText);
      console.log('Parsed response body:', responseBody);

      // Process the response based on the message
      const successMessages = [];
      const errorMessages = [];

      responseBody.forEach((item, index) => {
        console.log(`Response ${index + 1}: Message - ${item.message}`);
        if (item.message === 'OK') {
          successMessages.push(item.data.message); // Collect success messages
        } else {
          errorMessages.push(item.errors); // Collect errors
        }
      });

      // Return structured success/failure response
      if (successMessages.length > 0) {
        return {success: true, data: successMessages};
      } else {
        return {success: false, errors: errorMessages};
      }
    } catch (error) {
      console.error('Error in BulkUpdate:', error);
      return {success: false, message: error.message || 'Unexpected error'};
    }
  },
};
