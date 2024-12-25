import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AUTH_REDUCER } from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;


export const AuthSlice = createSlice({
  name: AUTH_REDUCER,
  initialState: [],
  reducers: {
    getLogin: state => {
      return { ...state, isLoginSuccess: null, error: null, message: '' };
    },
    loginSuccess: (state, action) => {
      return {
        ...state,
        isLoginSuccess: true,
        message: 'Fetch successfully',
        data: action.payload,
      };
    },
    loginFailure: (state, action) => {
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
      return { ...state, islogoutSuccess: FAIL, error: action.payload.message };
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
} = AuthSlice.actions;
const AuthReducer = AuthSlice.reducer;
export default AuthReducer;
