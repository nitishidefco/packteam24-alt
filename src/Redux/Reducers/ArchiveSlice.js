import {createSlice} from '@reduxjs/toolkit';
import {ARCHIVE_REDUCER} from '../SliceKey';
import moment from 'moment';
const initialState = {
  archivedMessages: [],
  filteredArchivedMessages: [],
  archivedSelectedMessages: [],
  currentPage: 1,
  totalMessages: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  currentFilter: {type: 'all', value: ''},
};

const archiveSlice = createSlice({
  name: ARCHIVE_REDUCER,
  initialState,
  reducers: {
    fetchArchivedMessagesStart(state) {
      console.log('Fetch archvied start');

      state.isLoading = true;
      state.error = null;
    },
    fetchArchivedMessagesSuccess(state, action) {
      console.log('Fetch archvied success');

      const {messages, total, totalPages} = action.payload;
      const sortedMessages = [...messages].sort((a, b) =>
        moment(b.created_at).diff(moment(a.created_at)),
      );

      if (state.currentPage === 1) {
        state.archivedMessages = sortedMessages;
        state.filteredArchivedMessages = sortedMessages;
      } else {
        state.archivedMessages = [...state.archivedMessages, ...sortedMessages];
        state.filteredArchivedMessages = [
          ...state.filteredArchivedMessages,
          ...sortedMessages,
        ];
      }
      state.totalMessages = total;
      state.totalPages = totalPages;
      state.isLoading = false;
    },
    fetchArchivedMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    moveToMessagesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    moveToMessagesSuccess(state, action) {
      const messageIds = action.payload;
      state.archivedMessages = state.archivedMessages.filter(
        message => !messageIds.includes(message.id),
      );
      state.filteredArchivedMessages = state.filteredArchivedMessages.filter(
        message => !messageIds.includes(message.id),
      );
      state.archivedSelectedMessages = [];
      state.totalMessages = state.archivedMessages.length;
      state.isLoading = false;
    },
    moveToMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteMessagesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    deleteMessagesSuccess(state, action) {
      const messageIds = action.payload;
      state.archivedMessages = state.archivedMessages.filter(
        message => !messageIds.includes(message.id),
      );
      state.filteredArchivedMessages = state.filteredArchivedMessages.filter(
        message => !messageIds.includes(message.id),
      );
      state.archivedSelectedMessages = [];
      state.totalMessages = state.archivedMessages.length;
      state.isLoading = false;
    },
    deleteMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    markAsUnread(state, action) {
      const messageId = action.payload;
      state.archivedMessages = state.archivedMessages.map(message =>
        message.id === messageId ? {...message, read: 0} : message,
      );
      state.filteredArchivedMessages = state.filteredArchivedMessages.map(
        message => (message.id === messageId ? {...message, read: 0} : message),
      );
    },

    toggleArchiveSelection(state, action) {
      const messageId = action.payload;
      if (state.archivedSelectedMessages.includes(messageId)) {
        state.archivedSelectedMessages = state.archivedSelectedMessages.filter(
          id => id !== messageId,
        );
      } else {
        state.archivedSelectedMessages.push(messageId);
      }
    },

    clearArchiveSelection(state) {
      state.archivedSelectedMessages = [];
    },

    filterArchivedMessages(state, action) {
      const {filterType, value} = action.payload;
      if (filterType === 'search') {
        state.filteredArchivedMessages = state.archivedMessages.filter(
          message => {
            const cleanContent = message.content
              .replace(/<\/?[^>]+(>|$)/g, '')
              .toLowerCase();
            const searchQuery = value.toLowerCase();
            return (
              message.topic.toLowerCase().includes(searchQuery) ||
              cleanContent.includes(searchQuery)
            );
          },
        );
      } else if (filterType === 'readStatus') {
        if (value === 'all') {
          state.filteredArchivedMessages = state.archivedMessages;
        } else {
          state.filteredArchivedMessages = state.archivedMessages.filter(
            message => message.read === (value === 'read' ? 1 : 0),
          );
        }
      } else if (filterType === 'all') {
        state.filteredArchivedMessages = state.archivedMessages;
      }
      state.currentPage = 1;
      state.currentFilter = {type: filterType, value};
    },

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    multipleMarkMessages(state) {
      state.isLoading = true;
      state.error = null;
    },
    multipleMarkMessagesSuccess(state, action) {
      const {messageIds, read} = action.payload;
      const readValue = read ? 1 : 0;
      state.archivedMessages = state.archivedMessages.map(message =>
        messageIds.includes(message.id)
          ? {...message, read: readValue}
          : message,
      );
      state.filteredArchivedMessages = state.filteredArchivedMessages.map(
        message =>
          messageIds.includes(message.id)
            ? {...message, read: readValue}
            : message,
      );
      state.archivedSelectedMessages = [];
      state.isLoading = false;
    },
    multipleMarkMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    markAsRead(state, action) {
      const messageId = action.payload;
      state.archivedMessages = state.archivedMessages.map(message =>
        message.id === messageId ? {...message, read: 1} : message,
      );
      state.filteredArchivedMessages = state.filteredArchivedMessages.map(
        message => (message.id === messageId ? {...message, read: 1} : message),
      );
    },
    searchArchivedMessagesStart(state) {
      state.isLoading = true;
      state.error = null;
    },

    searchArchivedMessagesSuccess(state, action) {
      const {messages} = action.payload;

      state.filteredArchivedMessages = messages;
      state.isLoading = false;
      // state.currentFilter = {type: 'search', value: action.payload.keyword};
    },

    searchArchivedMessagesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchArchivedMessagesStart,
  fetchArchivedMessagesSuccess,
  fetchArchivedMessagesFailure,
  moveToMessagesStart,
  moveToMessagesSuccess,
  moveToMessagesFailure,
  deleteMessagesStart,
  deleteMessagesSuccess,
  deleteMessagesFailure,
  multipleMarkMessages,
  multipleMarkMessagesSuccess,
  multipleMarkMessagesFailure,
  markAsUnread,
  markAsRead,
  toggleArchiveSelection,
  clearArchiveSelection,
  filterArchivedMessages,
  setCurrentPage,
  searchArchivedMessagesStart,
  searchArchivedMessagesSuccess,
  searchArchivedMessagesFailure,
} = archiveSlice.actions;

const ArchiveReducer = archiveSlice.reducer;

export default ArchiveReducer;
