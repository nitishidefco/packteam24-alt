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
      console.log(
        '-------------------action.payload---------------',
        action.payload,
      );

      const {sessionId, time, tagId} = action.payload;
      if (!state.sessions[sessionId]) {
        state.sessions[sessionId] = {sessionId, items: []};
      }
      state.sessions[sessionId].items.push({time, tagId});
    },

    clearOfflineStorage: state => {
      console.log(
        '-------------------clearOfflineStorage---------------',
        state,
      );

      state.sessions = {};
    },
  },
});

export const {addDataToOfflineStorage} = SaveDataOfflineSlice.actions;
const SaveDataOfflineReducer = SaveDataOfflineSlice.reducer;
export default SaveDataOfflineReducer;
