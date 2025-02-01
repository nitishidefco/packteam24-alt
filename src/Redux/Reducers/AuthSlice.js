import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AUTH_REDUCER} from '../SliceKey';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

export const AuthSlice = createSlice({
  name: AUTH_REDUCER,
  initialState: [],
  reducers: {
    getLogin: state => {
      console.log('reducer login state', state);

      return {...state, isLoginSuccess: null, error: null, message: ''};
    },
    loginSuccess: (state, action) => {
      console.log('login success', action.payload);

      return {
        ...state,
        isLoginSuccess: true,
        message: 'Fetch successfully',
        data: action.payload,
      };
    },
    loginFailure: (state, action) => {
      console.log('login Fail', action.payload);
      return {
        ...state,
        isLoginSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },

    getLogout: state => {
      return {
        ...state,
        islogoutSuccess: true,
        error: null,
        message: '',
      };
    },
    logoutSuccess: (state, action) => {
      return {
        ...state,
        islogoutSuccess: SUCCESS,
        message: action.payload.message,
        logoutData: action.payload,
      };
    },
    logoutFailure: (state, action) => {
      return {...state, islogoutSuccess: FAIL, error: action.payload.message};
    },

    getForgotPassword: state => {
      return {
        ...state,
        isForgotPasswordSuccess: null,
        error: null,
        message: '',
      };
    },
    forgotPasswordSuccess: (state, action) => {
      return {
        ...state,
        isForgotPasswordSuccess: true,
        message: 'Fetch successfully',
        data: action.payload,
      };
    },
    forgotPasswordFailure: (state, action) => {
      return {
        ...state,
        isForgotPasswordSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
    createAccount: state => {
      return {...state, isAccountCreateSuccess: null, error: null, message: ''};
    },
    createAccountSuccess: (state, action) => {
      return {
        ...state,
        isAccountCreateSuccess: true,
        message: 'Fetch successfully',
        data: action.payload,
      };
    },
    createAccountFailure: (state, action) => {
      return {
        ...state,
        isAccountCreateSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
  },
});

export const {
  loginFailure,
  loginSuccess,
  getLogin,
  getLogout,
  logoutFailure,
  logoutSuccess,
  getForgotPassword,
  forgotPasswordFailure,
  forgotPasswordSuccess,
  createAccount,
  createAccountFailure,
  createAccountSuccess,
} = AuthSlice.actions;
const AuthReducer = AuthSlice.reducer;
export default AuthReducer;
