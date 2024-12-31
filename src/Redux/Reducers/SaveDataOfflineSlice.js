import {createSlice} from '@reduxjs/toolkit';
import {OFFLINE_REDUCER} from '../SliceKey';
import {ValidateTagAction} from '../../Helpers';

const initialState = {
  sessions: {},
  isConnected: true,
  isSyncing: false,
};

const SaveDataOfflineSlice = createSlice({
  name: OFFLINE_REDUCER,
  initialState,
  reducers: {
    addDataToOfflineStorage: (state, action) => {
      const {sessionId, time, tagId} = action.payload;

      // Step 1: Validate the tag action first
      const sessionItems = state.sessions[sessionId]?.items || [];
      const validationResult = ValidateTagAction(tagId, sessionItems);

      if (!validationResult.valid) {
        console.warn('Validation failed:', validationResult.message);
        return; // Early exit if validation fails
      }

      // Step 2: Ensure the session exists or create it
      if (!state.sessions[sessionId]) {
        state.sessions[sessionId] = {sessionId, items: []};
      }

      // Step 3: Check only the most recent tag to prevent accidental double-scans
      const items = state.sessions[sessionId].items;
      if (items.length > 0) {
        const mostRecentTag = items[items.length - 1];
        if (mostRecentTag.tagId === tagId) {
          console.warn('Preventing duplicate consecutive scan');
          return; // Prevent consecutive duplicate scans
        }
      }

      // Step 4: Add valid tag to offline storage
      state.sessions[sessionId].items.push({time, tagId});
    },

    clearOfflineStorage: state => {
      state.sessions = {}; // Reset session storage
    },
  },
});

export const {addDataToOfflineStorage, clearOfflineStorage} =
  SaveDataOfflineSlice.actions;
const SaveDataOfflineReducer = SaveDataOfflineSlice.reducer;
export default SaveDataOfflineReducer;
