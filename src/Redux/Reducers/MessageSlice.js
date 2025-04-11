// src/Redux/Reducers/MessageReducer.js
import {createSlice} from '@reduxjs/toolkit';
import {MESSAGE_REUCER} from '../SliceKey';

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

      if (state.currentPage === 1) {
        state.messages = messages;
        state.filteredMessages = messages;
      } else {
        state.messages = [...state.messages, ...messages];
        state.filteredMessages = [...state.filteredMessages, ...messages];
      }
      state.totalMessages = total;
      state.totalPages = totalPages;
      state.isLoading = false;
      state.selectedMessages = state.selectedMessages || [];
      state.previewMessage = state.previewMessage || null;
      state.currentFilter = state.currentFilter || {type: 'all', value: ''};
      state.unreadCount = state.unreadCount || 0;
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

    // Set current page for pagination
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },

    filterMessages(state, action) {
      const {filterType, value} = action.payload;
      if (filterType === 'search') {
        state.filteredMessages = state.messages.filter(message => {
          // Remove HTML tags from content and convert to lowercase
          const cleanContent = message.content
            .replace(/<\/?[^>]+(>|$)/g, '')
            .toLowerCase();
          const searchQuery = value.toLowerCase();
          return (
            message.topic.toLowerCase().includes(searchQuery) ||
            cleanContent.includes(searchQuery)
          );
        });
      } else if (filterType === 'readStatus') {
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
    },
    toggleMessageSelection(state, action) {
      const messageId = action.payload;

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
      state.previewMessage = action.payload;
    },
    clearPreviewMessage(state) {
      state.previewMessage = null;
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
} = messageSlice.actions;

const MessageReducer = messageSlice.reducer;

export default MessageReducer;
