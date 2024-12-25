import {createSlice} from '@reduxjs/toolkit';
import {HOME_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

export const HomeSlice = createSlice({
  name: HOME_REDUCER,
  initialState: [],
  reducers: {
    getHome: state => {
      return {...state, isHomeSuccess: NULL, error: null, message: ''};
    },
    HomeSuccess: (state, action) => {
      return {
        ...state,
        isHomeSuccess: SUCCESS,
        message: 'Fetch successfully',
        data: action.payload,
      };
    },
    HomeFailure: (state, action) => {
      return {
        ...state,
        isHomeSuccess: FAIL,
        error: action.payload,
        message: 'Something went wrong',
      };
    },
  },
});

export const {getHome, HomeFailure, HomeSuccess} = HomeSlice.actions;
const HomeReducer = HomeSlice.reducer;
export default HomeReducer;
