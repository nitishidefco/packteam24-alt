// src/Services/MessageService.js
import {Constants} from '../../Config';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

const MessageService = {
  GetNotifications: async params => {
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
  SearchKeyword: async params => {
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

  MarkAsRead: async params => {
    return fetch(`${BASE_URL}api/msg-mark-as-read`, {
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

  MoveToArchives: async params => {
    return fetch(`${BASE_URL}api/move-to-archives`, {
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

  MultipleMarkAsRead: async params => {
    console.log('params', params);

    return fetch(`${BASE_URL}api/multiple-read-unread`, {
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
  GetArchivedMessages: async params => {
    return fetch(`${BASE_URL}api/notifications?archived=1`, {
      method: 'POST',
      body: params,
      headers: {
        Accept: 'multipart/form-data',
      },
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => data);
  },

  PermanentlyDelete: async params => {
    return fetch(`${BASE_URL}api/move-to-archives`, {
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
