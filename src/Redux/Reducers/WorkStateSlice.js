import {createSlice} from '@reduxjs/toolkit';
import {WORKSTATE_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const workStateSlice = createSlice({
  name: WORKSTATE_REDUCER,
  initialState: {
    currentState: null,
    isFetchSuccess: null,
    error: null,
    message: '',
    data: null, // Add this field to maintain consistency
  },
  reducers: {
    fetchWorkStatus: state => {
      state.isFetchSuccess = NULL;
      state.error = null;
      state.message = '';
    },
    FetchSuccess: (state, action) => {

      state.currentState = action.payload?.data;
      state.isFetchSuccess = SUCCESS;
      state.message = 'Fetch Successfully';
      state.data = action.payload;
    },
    FetchFailure: (state, action) => {
      if (action.payload?.message !== 'OK') {
        state.currentState = action.payload?.message;
      }
      state.isFetchSuccess = FAIL;
      state.error = action.payload;
      state.message = 'Something went wrong';
    },
    OffineStatus: (state, action) => {
      state.currentState = null;
    },
  },
});

export const {FetchFailure, FetchSuccess, fetchWorkStatus, OffineStatus} =
  workStateSlice.actions;

const WorkStateReducer = workStateSlice.reducer;
export default WorkStateReducer;
