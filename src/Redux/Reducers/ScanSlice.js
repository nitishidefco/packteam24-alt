import {createSlice} from '@reduxjs/toolkit';
import {SCAN_REDUCER} from '../SliceKey';
import {errorToast, success} from '../../Helpers/ToastMessage';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const initialState = {
  currentState: null,
  isScanSuccess: false,
  error: null,
  message: '',
  data: null,
  isLoading: false,
  normalScanLoading: false,
  singleScanError: false,
};

export const ScanSlice = createSlice({
  name: SCAN_REDUCER,
  initialState,
  reducers: {
    getScan: state => {
      state.isScanSuccess = false;
      state.singleScanError = false;
      state.message = '';
      state.normalScanLoading = true;
    },
    ScanSuccess: (state, action) => {
      console.log('action payload of scan success', action.payload);

      const {payload} = action;
      success(payload?.message);
      // toastMessage.success(payload?.data?.message);

      state.currentState = payload?.mode;
      state.isScanSuccess = true;
      state.message = 'Fetch successfully';
      state.data = payload;
      state.normalScanLoading = false;
      state.singleScanError = false;
    },
    ScanFailure: (state, action) => {
      const {payload} = action;
      if (payload?.message) {
        state.currentState = payload.message;
      } else if (payload?.nfc_key) {
        errorToast(payload?.nfc_key);
      }
      state.isScanSuccess = false;
      state.error = payload;
      state.singleScanError = true;
      state.message = 'Something went wrong';
      state.normalScanLoading = false;
    },
    sendBulk: (state, action) => {
      state.isScanSuccess = NULL;
      state.error = null;
      state.message = '';
      state.isLoading = true;
    },
    SendSuccess: (state, action) => {
      const {payload} = action;
      console.log('Send success payload', payload);
      state.isScanSuccess = SUCCESS;
      state.message = 'Send bulk successfully';
      state.isLoading = false;
    },
    SendFailure: (state, action) => {
      state.isScanSuccess = FAIL;
      state.message = 'Send Bulk failed';
      state.isLoading = false;
    },
  },
});

export const {
  getScan,
  ScanSuccess,
  ScanFailure,
  sendBulk,
  SendFailure,
  SendSuccess,
} = ScanSlice.actions;
export default ScanSlice.reducer;
