// src/Redux/Reducers/MessageReducer.js
import {createSlice} from '@reduxjs/toolkit';
import {MESSAGE_REUCER} from '../SliceKey';
import moment from 'moment-timezone';

const initialState = {
  messages: [],
  filteredMessages: [],
  selectedMessages: [],
  previewMessage: null,
  currentPage: 1,
  totalMessages: 0,
  totalPages: 0,
  unreadCount: 0,
  isLoading: false,
  error: null,
  currentFilter: {type: 'all', value: ''},
};

const messageSlice = createSlice({
  name: MESSAGE_REUCER,
  initialState,
  reducers: {
    fetchMessagesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchMessagesSuccess(state, action) {
      const {messages, total, totalPages} = action.payload;
      console.log(
        '[fetchMessagesSuccess] Received messages:',
        messages.map(m => ({id: m.id, created_at: m.created_at})),
      );

      // Sort messages by id in descending order
      const sortedMessages = [...messages].sort((a, b) => b.id - a.id);

      console.log(
        '[fetchMessagesSuccess] Sorted messages:',
        sortedMessages.map(m => ({id: m.id, created_at: m.created_at})),
      );

      if (state.currentPage === 1) {
        state.messages = sortedMessages; // New array reference
        state.filteredMessages = sortedMessages;
      } else {
        state.messages = [...state.messages, ...sortedMessages]; // New array reference
        state.filteredMessages = [...state.filteredMessages, ...sortedMessages];
      }
      state.totalMessages = total;
      state.totalPages = totalPages;
      state.isLoading = false;
    },
    fetchMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch unread count
    fetchUnreadCountStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchUnreadCountSuccess(state, action) {
      state.unreadCount = action.payload;
      state.isLoading = false;
    },
    fetchUnreadCountFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    multipleMarkMessages(state) {
      state.isLoading = true;
      state.error = null;
    },
    multipleMarkMessagesSuccess(state, action) {
      const {messageIds, read} = action.payload;
      const readValue = read ? 1 : 0;
      state.messages = state.messages.map(message =>
        messageIds.includes(message.id)
          ? {...message, read: readValue}
          : message,
      );
      state.filteredMessages = state.filteredMessages.map(message =>
        messageIds.includes(message.id)
          ? {...message, read: readValue}
          : message,
      );
      if (
        state.previewMessage &&
        messageIds.includes(state.previewMessage.id)
      ) {
        state.previewMessage = {...state.previewMessage, read: readValue};
      }
      state.unreadCount = read
        ? Math.max(0, state.unreadCount - messageIds.length)
        : state.unreadCount + messageIds.length;
      state.selectedMessages = [];
      state.isLoading = false;
    },
    multipleMarkMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Set current page for pagination
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },

    searchMessagesStart(state) {
      state.isLoading = true;
      state.error = null;
    },

    searchMessagesSuccess(state, action) {
      const {messages} = action.payload;
      console.log('Action payload of serach message succes', action.payload);

      state.filteredMessages = messages;
      state.isLoading = false;
      // state.currentFilter = {type: 'search', value: action.payload.keyword};
    },
    searchMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    filterMessages(state, action) {
      const {filterType, value} = action.payload;
      if (filterType === 'readStatus') {
        if (value === 'all') {
          state.filteredMessages = state.messages;
        } else {
          state.filteredMessages = state.messages.filter(
            message => message.read === (value === 'read' ? 1 : 0),
          );
        }
      } else if (filterType === 'all') {
        state.filteredMessages = state.messages;
      }
      state.currentPage = 1;
      state.currentFilter = {type: filterType, value};
    },

    toggleMessageSelection(state, action) {
      const messageId = action.payload;
      console.log('selected messages', state.selectedMessages);

      if (state.selectedMessages.includes(messageId)) {
        state.selectedMessages = state.selectedMessages.filter(
          id => id !== messageId,
        );
      } else {
        state.selectedMessages.push(messageId);
      }
    },

    // Clear message selection
    clearMessageSelection(state) {
      state.selectedMessages = [];
    },
    setPreviewMessage(state, action) {
      console.log('Action payload preview message', action.payload);

      state.previewMessage = action.payload;
    },
    clearPreviewMessage(state) {
      state.previewMessage = null;
    },
    markAsRead(state, action) {
      const messageId = action.payload;
      state.messages = state.messages.map(message =>
        message.id === messageId ? {...message, read: 1} : message,
      );
      state.filteredMessages = state.filteredMessages.map(message =>
        message.id === messageId ? {...message, read: 1} : message,
      );
      if (state.previewMessage && state.previewMessage.id === messageId) {
        state.previewMessage = {...state.previewMessage, read: 1};
      }
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },

    markAsReadFailure(state, action) {
      const messageId = action.payload;
      state.messages = state.messages.map(message =>
        message.id === messageId ? {...message, read: 0} : message,
      );
      state.filteredMessages = state.filteredMessages.map(message =>
        message.id === messageId ? {...message, read: 0} : message,
      );
      if (state.previewMessage && state.previewMessage.id === messageId) {
        state.previewMessage = {...state.previewMessage, read: 0};
      }
      state.unreadCount += 1;
    },
    moveToArchiveStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    moveToArchiveSuccess(state, action) {
      const messageIds = action.payload;
      state.messages = state.messages.filter(
        message => !messageIds.includes(message.id),
      );
      state.filteredMessages = state.filteredMessages.filter(
        message => !messageIds.includes(message.id),
      );
      state.selectedMessages = state.selectedMessages.filter(
        id => !messageIds.includes(id),
      );
      if (
        state.previewMessage &&
        messageIds.includes(state.previewMessage.id)
      ) {
        state.previewMessage = null;
      }
      state.isLoading = false;
      state.totalMessages = state.messages.length;
    },
    moveToArchiveFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  fetchUnreadCountStart,
  fetchUnreadCountSuccess,
  fetchUnreadCountFailure,
  setCurrentPage,
  filterMessages,
  toggleMessageSelection,
  clearMessageSelection,
  setPreviewMessage,
  clearPreviewMessage,
  searchMessagesStart,
  searchMessagesSuccess,
  searchMessagesFailure,
  markAsRead,
  markAsReadFailure,
  moveToArchiveStart,
  moveToArchiveSuccess,
  moveToArchiveFailure,
  multipleMarkMessages,
  multipleMarkMessagesSuccess,
  multipleMarkMessagesFailure,
} = messageSlice.actions;

const MessageReducer = messageSlice.reducer;

export default MessageReducer;
