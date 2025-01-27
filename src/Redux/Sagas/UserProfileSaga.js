import {all, call, put, take, takeEvery} from 'redux-saga/effects';
import API from '../Services/UserProfileService';
import LOGOUT_API from '../Services/AuthServices';
import {USER_PROFILE_REDUCER, AUTH_REDUCER} from '../SliceKey';
import {
  fetchUserProfileSuccess,
  fetchUserProfileFail,
  updateUserProfileSuccess,
  updateUserProfileFail,
  removeProfilePhotoSuccess,
  removeProfilePhotoFail,
  removeAccountSuccess,
  removeAccountFail,
} from '../Reducers/UserProfileSlice';
import {errorToast, success} from '../../Helpers/ToastMessage';
import i18n from '../../i18n/i18n';
// Fetch Profile Saga
function* fetchUserProfileSaga({payload}) {
  try {
    const response = yield call(API.Profile, payload);
    if (response?.data) {
      // Check for data property
      yield put(fetchUserProfileSuccess(response.data));
    } else if (response?.errors) {
      yield put(fetchUserProfileFail(response.errors));
    }
  } catch (error) {
    console.error('Fetching user profile error', error);
    yield put(FetchFailure(error.message));
  }
}

// Update Profile Saga
function* updateUserProfileSaga({payload}) {
  try {
    const response = yield call(API.UpdateProfile, payload); // Assuming there's an updateProfile method

    if (response?.data) {
      yield put(updateUserProfileSuccess(response.data));
      success(i18n.t('Toast.ProfileUpdated'));
    } else if (response?.errors) {
      yield put(updateUserProfileFail(response.errors));
      errorToast(i18n.t('Toast.ErrorUpdatingProfile'));
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
      yield put(removeProfilePhotoSuccess(response.data));
      yield put({type: `${USER_PROFILE_REDUCER}/fetchUserProfile`, payload});
      success(i18n.t('Toast.PhotoRemovedSuccessfully'));
    } else if (response?.errors) {
      yield put(removeProfilePhotoFail(response.errors));
      errorToast(i18n.t('Toast.ErrorRemovingProfilePhoto'));
    }
  } catch (error) {
    console.error('Error removing profile photo', error);
    yield put(removeProfilePhotoFail(error.message));
  }
}
function* removeUserAccountSaga({payload}) {
  try {
    const response = yield call(API.RemoveAccount, payload.payload);
    console.log('remove user account response', response);

    if (response?.data) {
      yield put(removeAccountSuccess(response.data));
      yield put({type: `${AUTH_REDUCER}/getLogout`, payload});
      success('Your account has been removed successfully');
      payload.navigation.replace('Login');
      // success(i18n.t('Toast.PhotoRemovedSuccessfully'));
    } else if (response?.errors) {
      yield put(removeAccountFail(response.errors));
      // yield put({type: `${USER_PROFILE_REDUCER}/fetchUserProfile`, payload});

      // errorToast(i18n.t('Toast.ErrorRemovingProfilePhoto'));
    }
  } catch (error) {
    console.error('Error removing profile photo', error);
    yield put(removeAccountFail(error.message));
    yield put({type: `${USER_PROFILE_REDUCER}/fetchUserProfile`, payload});
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
    takeEvery(`${USER_PROFILE_REDUCER}/removeAccount`, removeUserAccountSaga),
  ]);
}

export default userProfileSaga;
