import {createSlice} from '@reduxjs/toolkit';
import {PASSWORD_CHANGE_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const passwordChangeSlice = createSlice({
  name: PASSWORD_CHANGE_REDUCER,
  initialState: {
    data: null,
    isChangeSuccess: null,
    error: null,
    message: null,
    isLoading: null,
  },
  reducers: {
    changePassword: state => {
      state.isChangeSuccess = NULL;
      state.error = NULL;
      state.message = '';
      state.isLoading = true;
    },
    changePasswordSuccess: (state, action) => {
      state.data = action.payload;
      state.message = 'Password changed successfully';
      state.isChangeSuccess = SUCCESS;
      state.isLoading = false;
    },
    changePasswordFail: (state, action) => {
      state.error = action.payload;
      state.message = 'Something went wrong';
      state.isChangeSuccess = FAIL;
      state.isLoading = false;
    },
  },
});

export const {changePassword, changePasswordSuccess, changePasswordFail} =
  passwordChangeSlice.actions;

const PasswordChangeReducer = passwordChangeSlice.reducer;
export default PasswordChangeReducer;
