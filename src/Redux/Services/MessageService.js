// src/Services/MessageService.js
import {Constants} from '../../Config';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

const MessageService = {
  GetNotifications: async params => {
    console.log('Get', params);

    return fetch(`${BASE_URL}api/notifications`, {
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

  GetUnreadCount: async params => {
    return fetch(`${BASE_URL}api/unread-notifications-count`, {
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

export default MessageService;
