import {createSlice} from '@reduxjs/toolkit';
import {GET_NFC_TAGS_FROM_SERVER_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const initialState = {
  currentState: null,
  isFetchSuccess: null,
  error: null,
  message: '',
  data: null, // Add this for consistent structure
};

export const GetNfcTagsFromServerSlice = createSlice({
  name: GET_NFC_TAGS_FROM_SERVER_REDUCER,
  initialState,
  reducers: {
    fetchNfcTags: state => {
      state.isFetchSuccess = NULL; // Update draft state
      state.error = null;
      state.message = '';
    },
    FetchSuccess: (state, action) => {
      state.currentState = action.payload?.data; // Update draft state
      state.isFetchSuccess = SUCCESS;
      state.message = 'Fetch Successfully';
      state.data = action.payload;
    },
    FetchFailure: (state, action) => {
      if (action.payload?.message !== 'OK') {
        state.currentState = action.payload?.message; // Update draft state directly
      }
      state.isFetchSuccess = FAIL;
      state.error = action.payload;
      state.message = 'Something went wrong';
    },
  },
});

export const {fetchNfcTags, FetchSuccess, FetchFailure} =
  GetNfcTagsFromServerSlice.actions;

const GetNfcTagsFromServerReducer = GetNfcTagsFromServerSlice.reducer;

export default GetNfcTagsFromServerReducer;
