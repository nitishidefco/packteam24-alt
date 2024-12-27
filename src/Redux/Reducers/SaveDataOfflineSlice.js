import {createSlice} from '@reduxjs/toolkit';
import {OFFLINE_REDUCER} from '../SliceKey';

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

      // Check if the session doesn't exist, and create it if necessary
      if (!state.sessions[sessionId]) {
        state.sessions[sessionId] = {sessionId, items: []};
      }

      // Check if the tagId already exists in the session's items array
      const tagExists = state.sessions[sessionId].items.some(
        item => item.tagId === tagId,
      );

      // If the tagId already exists, do not add it again
      if (tagExists) {
        return; // Exit without modifying the state
      }

      // If the tagId does not exist, add the new item to the session
      state.sessions[sessionId].items.push({time, tagId});
    },

    clearOfflineStorage: state => {
      state.sessions = {};
    },
  },
});

export const {addDataToOfflineStorage, clearOfflineStorage} =
  SaveDataOfflineSlice.actions;
const SaveDataOfflineReducer = SaveDataOfflineSlice.reducer;
export default SaveDataOfflineReducer;
