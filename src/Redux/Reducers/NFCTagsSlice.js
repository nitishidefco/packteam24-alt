import {createSlice} from '@reduxjs/toolkit';
import {GET_NFC_TAGS_FROM_SERVER_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const initialState = {currentState: null};

export const GetNfcTagsFromServerSlice = createSlice({
  name: GET_NFC_TAGS_FROM_SERVER_REDUCER,
  initialState: initialState,
  reducers: {
    fetchNfcTags: state => {
      return {
        ...state,
        isFetchSuccess: NULL,
        error: null,
        message: '',
      };
    },
    FetchSuccess: (state, action) => {
      initialState.currentState = action.payload?.data;
      return {
        ...state,
        isFetchSuccess: SUCCESS,
        message: 'Fetch Successfully',
        data: action.payload,
      };
    },
    FetchFailure: (state, action) => {
      if (action.payload?.message !== 'OK') {
        initialState.currentState = action.payload?.message;
      }
      return {
        ...state,
        isFetchSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
  },
});

export const {fetchNfcTags, FetchSuccess, FetchFailure} =
  GetNfcTagsFromServerSlice.actions;
const GetNfcTagsFromServerReducer = GetNfcTagsFromServerSlice.reducer;

export default GetNfcTagsFromServerReducer;
