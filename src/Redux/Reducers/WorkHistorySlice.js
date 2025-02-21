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
  workHistoryLoading: false,
};

export const WorkHistorySlice = createSlice({
  name: WORK_HISTORY_REDUCER,
  initialState,
  reducers: {
    getWorkHistory: state => {
      state.isFetchWorkHistorySuccess = NULL;
      state.error = null;
      state.message = '';
      state.workHistoryLoading = true;
    },
    FetchWorkHistorySuccess: (state, action) => {
      const {payload} = action;
      // success(payload?.data?.message);
      state.isFetchWorkHistorySuccess = SUCCESS;
      state.message = 'Fetch successfull';
      state.data = payload.data;
      state.workHistoryLoading = false;
    },
    FetchWorkHistoryFailure: (state, action) => {
      const {payload} = action;

      if (payload?.message) {
        //  error(payload?.errors)
        state.data = payload;
      }
      state.isFetchWorkHistorySuccess = FAIL;
      state.error = payload;
      state.workHistoryLoading = false;
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
