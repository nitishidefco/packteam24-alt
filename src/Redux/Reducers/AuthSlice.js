import {createSlice} from '@reduxjs/toolkit';
import {AUTH_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

export const AuthSlice = createSlice({
  name: AUTH_REDUCER,
  initialState: {
    isAuthenticated: null, // Tracks if the user is logged in
    isLoginSuccess: NULL,
    islogoutSuccess: NULL,
    isForgotPasswordSuccess: NULL,
    isAccountCreateSuccess: NULL,
    data: null,
    error: null,
    message: '',
  },
  reducers: {
    // Login reducers
    getLogin: state => {
      console.log('reducer login state', state);
      return {...state, isLoginSuccess: NULL, error: null, message: ''};
    },
    loginSuccess: (state, action) => {
      console.log('login success', action.payload);
      return {
        ...state,
        isAuthenticated: SUCCESS, // Mark user as authenticated
        isLoginSuccess: SUCCESS,
        message: 'Login successful',
        data: action.payload,
      };
    },
    loginFailure: (state, action) => {
      console.log('login Fail', action.payload);
      return {
        ...state,
        isAuthenticated: FAIL, // Ensure user is unauthenticated on failure
        isLoginSuccess: FAIL,
        error: action.payload,
        message: 'Login failed',
      };
    },

    // Logout reducers
    getLogout: state => {
      console.log('Logout state', state);

      return {...state, islogoutSuccess: NULL, error: null, message: ''};
    },
    logoutSuccess: state => {
      return {
        ...state,
        isAuthenticated: FAIL, // Mark user as logged out
        islogoutSuccess: SUCCESS,
        message: 'Logout successful',
        data: null,
      };
    },
    logoutFailure: (state, action) => {
      return {
        ...state,
        islogoutSuccess: FAIL,
        error: action.payload.message,
      };
    },

    // Forgot Password reducers
    getForgotPassword: state => {
      return {
        ...state,
        isForgotPasswordSuccess: NULL,
        error: null,
        message: '',
      };
    },
    forgotPasswordSuccess: (state, action) => {
      return {
        ...state,
        isForgotPasswordSuccess: SUCCESS,
        message: 'Password reset successful',
        data: action.payload,
      };
    },
    forgotPasswordFailure: (state, action) => {
      return {
        ...state,
        isForgotPasswordSuccess: FAIL,
        error: action.payload,
        message: 'Password reset failed',
      };
    },

    // Create Account reducers
    createAccount: state => {
      return {...state, isAccountCreateSuccess: NULL, error: null, message: ''};
    },
    createAccountSuccess: (state, action) => {
      return {
        ...state,
        isAccountCreateSuccess: SUCCESS,
        message: 'Account created successfully',
        data: action.payload,
      };
    },
    createAccountFailure: (state, action) => {
      return {
        ...state,
        isAccountCreateSuccess: FAIL,
        error: action.payload,
        message: 'Account creation failed',
      };
    },

    // Set authentication state manually (useful for initial load)
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload;
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
  setAuthState,
} = AuthSlice.actions;

export default AuthSlice.reducer;
