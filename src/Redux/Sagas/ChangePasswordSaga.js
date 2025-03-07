import {all, call, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/ChangePasswordService';
import {PASSWORD_CHANGE_REDUCER} from '../SliceKey';
import {
  changePasswordFail,
  changePasswordSuccess,
} from '../Reducers/PasswordChangeSlice';
import {errorToast, success} from '../../Helpers/ToastMessage';
import i18n from '../../i18n/i18n';

function* changePasswordSaga({payload}) {
  try {
    const response = yield call(API.ChangePassword, payload.payload);
    console.log('password change response', response);

    if (response?.data) {
      // Check for data property
      yield put(changePasswordSuccess(response.data));
      success(i18n.t('Toast.PasswordChangeSuccessfull'));
      payload.navigation.replace('HomeDrawer');
    } else if (response?.errors) {
      console.log(response);

      yield put(changePasswordFail(response.errors));

      if (response?.errors?.current_password) {
        errorToast(response?.errors?.current_password);
      } else {
        errorToast(response?.error?.message);
      }
    }
  } catch (error) {
    console.error('Updating password error', error.errors);
    yield put(changePasswordFail(error.errors.current_password));
    errorToast(error?.errors?.current_password);
  }
}

function* passwordSaga() {
  yield all([
    takeEvery(`${PASSWORD_CHANGE_REDUCER}/changePassword`, changePasswordSaga),
  ]);
}

export default passwordSaga;
