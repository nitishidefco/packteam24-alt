import {all, call, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/UserProfileService';
import {USER_PROFILE_REDUCER} from '../SliceKey';
import {FetchSuccess, FetchFailure} from '../Reducers/UserProfileSlice';
import ToastMessage from '../../Helpers/ToastMessage';

// Fetch Profile Saga
function* fetchUserProfileSaga({payload}) {
  try {
    const response = yield call(API.Profile, payload);
    if (response?.data) {
      // Check for data property
      yield put(FetchSuccess(response.data));
    } else if (response?.errors) {
      yield put(FetchFailure(response.errors));
    }
  } catch (error) {
    console.error('Fetching user profile error', error);
    yield put(FetchFailure(error.message));
  }
}

// Update Profile Saga
function* updateUserProfileSaga({payload}) {
  console.log('payload in saga', payload);

  try {
    const response = yield call(API.UpdateProfile, payload); // Assuming there's an updateProfile method
    console.log('respoisnss', response);

    if (response?.data) {
      yield put(FetchSuccess(response.data));
      ToastMessage.success('Profile Updated Successfully');
    } else if (response?.errors) {
      yield put(FetchFailure(response.errors));
      ToastMessage.error('There was an error update the Profile');
    }
  } catch (error) {
    console.error('Updating user profile error', error);
    yield put(FetchFailure(error.message));
  }
}
function* removeProfilePhotoSaga({payload}) {
  try {
    const response = yield call(API.RemoveProfilePhoto, payload);
    if (response?.data) {
      yield put(FetchSuccess(response.data));
      ToastMessage.success('Profile Photo Removed Successfully');
    } else if (response?.errors) {
      yield put(FetchFailure(response.errors));
      ToastMessage.error('There was an error removing the Profile Photo');
    }
  } catch (error) {
    console.error('Error removing profile photo', error);
  }
}
// Root Saga
function* userProfileSaga() {
  yield all([
    takeEvery(`${USER_PROFILE_REDUCER}/fetchUserProfile`, fetchUserProfileSaga),
    takeEvery(
      `${USER_PROFILE_REDUCER}/updateUserProfile`,
      updateUserProfileSaga,
    ),
    takeEvery(
      `${USER_PROFILE_REDUCER}/removeUserProfilePhoto`,
      removeProfilePhotoSaga,
    ),
  ]);
}

export default userProfileSaga;
