import {createSlice} from '@reduxjs/toolkit';
import {WORK_HISTORY_REDUCER} from '../SliceKey';
import {errorToast, success} from '../../Helpers/ToastMessage';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const initialState = {
  data: null,
  message: '',
  error: null,
  isFetchWorkHistorySuccess: NULL,
};

export const WorkHistorySlice = createSlice({
  name: WORK_HISTORY_REDUCER,
  initialState,
  reducers: {
    getWorkHistory: state => {
      state.isFetchWorkHistorySuccess = NULL;
      state.error = null;
      state.message = '';
    },
    FetchWorkHistorySuccess: (state, action) => {
      const {payload} = action;
      // success(payload?.data?.message);
      state.isFetchWorkHistorySuccess = SUCCESS;
      state.message = 'Fetch successfull';
      state.data = payload.data;
    },
    FetchWorkHistoryFailure: (state, action) => {
      const {payload} = action;
      console.log('failed payload', payload);

      if (payload?.message) {
        //  error(payload?.errors)
        state.data = payload;
      } 
      state.isFetchWorkHistorySuccess = FAIL;
      state.error = payload;
      state.message = 'Something went wrong';
    },
  },
});

export const {
  getWorkHistory,
  FetchWorkHistorySuccess,
  FetchWorkHistoryFailure,
} = WorkHistorySlice.actions;
const WorkHistoryReducer = WorkHistorySlice.reducer;
export default WorkHistoryReducer;
