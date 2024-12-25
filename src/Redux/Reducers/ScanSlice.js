import {createSlice} from '@reduxjs/toolkit';
import {SCAN_REDUCER} from '../SliceKey';
import {toastMessage} from '../../Helpers';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const initialState = {
  currentState: null,
};

export const ScanSlice = createSlice({
  name: SCAN_REDUCER,
  initialState: initialState,
  reducers: {
    getScan: state => {
      return {...state, isScanSuccess: NULL, error: null, message: ''};
    },
    ScanSuccess: (state, action) => {
      toastMessage.success(action.payload?.data?.mode);
      initialState.currentState = action.payload?.data[1];
      return {
        ...state,
        isScanSuccess: SUCCESS,
        message: 'Fetch successfully',
        data: action.payload,
      };
    },
    ScanFailure: (state, action) => {
      if (action.payload?.message) {
        toastMessage.error(action.payload?.message);
        initialState.currentState = action.payload?.message;
      } else if (action.payload?.nfc_key) {
        toastMessage.error(action.payload?.nfc_key);
      }
      return {
        ...state,
        isScanSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
  },
});

export const {getScan, ScanSuccess, ScanFailure} = ScanSlice.actions;
const ScanReducer = ScanSlice.reducer;
export default ScanReducer;
