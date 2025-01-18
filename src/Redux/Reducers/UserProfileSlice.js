import {createSlice} from '@reduxjs/toolkit';
import {USER_PROFILE_REDUCER} from '../SliceKey';

const NULL = null;
const SUCCESS = true;
const FAIL = false;

const userProfileSlice = createSlice({
  name: USER_PROFILE_REDUCER,
  initialState: {
    data: null,
    isFetchSuccess: null,
    error: null,
    message: null,
  },
  reducers: {
    fetchUserProfile: state => {
      state.isFetchSuccess = NULL;
      state.error = NULL;
      state.message = '';
    },
    updateUserProfile: state => {
      state.isFetchSuccess = NULL;
      state.error = NULL;
      state.message = '';
    },
    removeUserProfilePhoto: state => {
      state.isFetchSuccess = NULL;
      state.error = NULL;
      state.message = '';
    },
    FetchSuccess: (state, action) => {
      state.data = action?.payload;
      state.message = 'Fetch successfull';
      state.isFetchSuccess = SUCCESS
    },
    FetchFailure: (state, action) => {
      console.log('action.payload failure', action.payload);
      state.isFetchSuccess = FAIL;
      state.error = action.payload;
      state.message = 'Something went wrong';
    },
  },
});

export const {
  fetchUserProfile,
  updateUserProfile,
  FetchSuccess,
  FetchFailure,
  removeUserProfilePhoto,
} = userProfileSlice.actions;

const UserProfileReducer = userProfileSlice.reducer;
export default UserProfileReducer;
