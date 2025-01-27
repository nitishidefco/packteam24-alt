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
    /* --------------------------- update user profile -------------------------- */
    updateUserProfile: state => {
      state.isFetchSuccess = NULL;
      state.error = NULL;
      state.message = '';
    },
    updateUserProfileSuccess: (state, action) => {
      state.data = action?.payload;
      state.message = 'profile updated successfully';
      state.isFetchSuccess = SUCCESS;
    },
    updateUserProfileFail: (state, action) => {
      state.data = action?.payload;
      state.message = 'profile update failed';
      state.isFetchSuccess = FAIL;
    },
    /* -------------------------- Remove profile photo -------------------------- */
    removeUserProfilePhoto: state => {
      state.isFetchSuccess = NULL;
      state.error = NULL;
      state.message = '';
    },
    removeProfilePhotoSuccess: (state, action) => {
      state.data = action?.payload;
      state.message = 'photo removed successfully';
      state.isFetchSuccess = SUCCESS;
    },
    removeProfilePhotoFail: (state, action) => {
      state.data = action?.payload;
      state.message = 'profile remove failed';
      state.isFetchSuccess = FAIL;
    },
    /* --------------------------- fetch user profile --------------------------- */
    fetchUserProfile: state => {
      state.isFetchSuccess = NULL;
      state.error = NULL;
      state.message = '';
    },
    fetchUserProfileSuccess: (state, action) => {
      state.data = action?.payload;
      state.message = 'Fetch successfull';
      state.isFetchSuccess = SUCCESS;
    },
    fetchUserProfileFail: (state, action) => {
      state.isFetchSuccess = FAIL;
      state.error = action.payload;
      state.message = 'Something went wrong';
    },

    /* --------------------------- remove user account -------------------------- */
    removeAccount: state => {
      state.message = NULL;
      state.data = NULL;
      state.error = NULL;
    },
    removeAccountSuccess: (state, action) => {
      state.message = 'Account removed successfully';
      state.isFetchSuccess = SUCCESS;
    },
    removeAccountFail: (state, action) => {
      state.message = 'Account remove failed';
      state.isFetchSuccess = FAIL;
    },
  },
});

export const {
  fetchUserProfile,
  updateUserProfile,
  fetchUserProfileSuccess,
  fetchUserProfileFail,
  removeUserProfilePhoto,
  updateUserProfileSuccess,
  updateUserProfileFail,
  removeProfilePhotoSuccess,
  removeProfilePhotoFail,
  removeAccount,
  removeAccountSuccess,
  removeAccountFail,
} = userProfileSlice.actions;

const UserProfileReducer = userProfileSlice.reducer;
export default UserProfileReducer;
