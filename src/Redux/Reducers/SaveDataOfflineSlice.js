import {createSlice} from '@reduxjs/toolkit';
import {OFFLINE_REDUCER} from '../SliceKey';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  sessions: {},
  isConnected: true,
  isSyncing: false,
  tagInLocalStorage: '',
  bulkSessions: {},
};

const SaveDataOfflineSlice = createSlice({
  name: OFFLINE_REDUCER,
  initialState,
  reducers: {
    addDataToOfflineStorage: (state, action) => {
      const {sessionId, time, tagId, current_date, current_hour} =
        action.payload;

      // Step 2: Ensure the session exists or create it
      if (!state.sessions[sessionId]) {
        state.sessions[sessionId] = {sessionId, items: []};
      }

      // Step 3: Check only the most recent tag to prevent accidental double-scans
      const items = state.sessions[sessionId]?.items;
      if (items.length > 0) {
        const mostRecentTag = items[items.length - 1];
        if (mostRecentTag.tagId === tagId) {
          console.warn('Preventing duplicate consecutive scan');
          return; // Prevent consecutive duplicate scans
        }
      }

      // Step 4: Add valid tag to offline storage
      state.sessions[sessionId].items.push({
        time,
        tagId,
        current_hour,
        current_date,
      });
    },

    clearOfflineStorage: state => {
      state.sessions = {}; // Reset session storage
      state.bulkSessions = {};
    },
    dataForBulkUpdate: (state, action) => {
      const {sessionId, nfc_key, date, hour} = action.payload;
      try {
        if (!state.bulkSessions) {
          state.bulkSessions = {}; // Ensure bulkSessions exists
        }

        if (!state.bulkSessions[sessionId]) {
          state.bulkSessions[sessionId] = {sessionId, items: []};
        }

        // Get current items in the session
        const items = state.bulkSessions[sessionId]?.items;

        // Check the most recent NFC key to prevent duplicate scans
        if (items.length > 0) {
          const mostRecentEntry = items[items.length - 1];
          if (mostRecentEntry.nfc_key === nfc_key) {
            return; // Prevent consecutive duplicate scans
          }
        }

        // Add valid NFC data to bulk storage
        state.bulkSessions[sessionId].items.push({
          nfc_key,
          date,
          hour,
        });
      } catch (error) {
        console.error('❌ Error in bulk update reducer:', error);
      }
    },

    saveTag: (state, action) => {
      console.log('tag===>', action.payload);

      switch (action.payload) {
        case 'work_start':
          state.tagInLocalStorage = 'work_in_progress';
          break;
        case 'break_start':
          state.tagInLocalStorage = 'break_in_progress';
          break;
        case 'work_end':
          state.tagInLocalStorage = 'work_finished';
          break;
        case 'work_in_progress':
          state.tagInLocalStorage = action.payload;
          break;
        case 'break_in_progress':
          state.tagInLocalStorage = action.payload;
          break;
        case 'work_finished':
          state.tagInLocalStorage = action.payload;
          break;
        default:
          console.log('do nothing');

          // state.tagInLocalStorage = null;
          break;
      }
    },
  },
});

export const {
  addDataToOfflineStorage,
  clearOfflineStorage,
  saveTag,
  dataForBulkUpdate,
} = SaveDataOfflineSlice.actions;

export const saveTagToLocalStorage = tagMode => async dispatch => {
  console.log('save====>', tagMode);

  switch (tagMode) {
    case 'work_start':
      console.log('tagMode in save data offline slice', tagMode);

      await AsyncStorage.setItem('tagMode', 'work_in_progress');
      dispatch(saveTag(tagMode));
      break;
    case 'break_start':
      await AsyncStorage.setItem('tagMode', 'break_in_progress');
      dispatch(saveTag(tagMode));
      break;
    case 'work_end':
      dispatch(saveTag(tagMode));
      await AsyncStorage.setItem('tagMode', 'work_finished');
      break;
  }
};

export const loadTagFromLocalStorage = () => async dispatch => {
  try {
    const tagRetrivedFromLocalStorage = await AsyncStorage.getItem('tagMode');
    console.log('Tag retrevied from localStorage');

    dispatch(saveTag(tagRetrivedFromLocalStorage));
  } catch (error) {
    console.error('Error getting tag from localstorage', error);
  }
};
const SaveDataOfflineReducer = SaveDataOfflineSlice.reducer;
export default SaveDataOfflineReducer;
