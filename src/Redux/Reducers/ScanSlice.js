import {createSlice} from '@reduxjs/toolkit';
import {SCAN_REDUCER} from '../SliceKey';
import {errorToast, success} from '../../Helpers/ToastMessage';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const initialState = {
  currentState: null,
  isScanSuccess: NULL,
  error: null,
  message: '',
  data: null,
};

export const ScanSlice = createSlice({
  name: SCAN_REDUCER,
  initialState,
  reducers: {
    getScan: state => {
      state.isScanSuccess = NULL;
      state.error = null;
      state.message = '';
    },
    ScanSuccess: (state, action) => {


      const {payload} = action;
      success(payload?.data?.message);
      // toastMessage.success(payload?.data?.message);

      state.currentState = payload?.data[1];
      state.isScanSuccess = SUCCESS;
      state.message = 'Fetch successfully';
      state.data = payload;
    },
    ScanFailure: (state, action) => {
      const {payload} = action;

      if (payload?.message) {
        //  error(payload?.errors)
        state.currentState = payload.message;
      } else if (payload?.nfc_key) {
        errorToast(payload?.nfc_key);
        // toastMessage.error(payload.nfc_key);
      }
      state.isScanSuccess = FAIL;
      state.error = payload;
      state.message = 'Something went wrong';
    },
  },
});

export const {getScan, ScanSuccess, ScanFailure} = ScanSlice.actions;
export default ScanSlice.reducer;
