import {all, call, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/ChangePasswordService';
import {PASSWORD_CHANGE_REDUCER} from '../SliceKey';
import {
  changePasswordFail,
  changePasswordSuccess,
} from '../Reducers/PasswordChangeSlice';
import {toastMessage} from '../../Helpers';
import {success} from '../../Helpers/ToastMessage';
import i18n from '../../i18n/i18n';

function* changePasswordSaga({payload}) {
  try {
    const response = yield call(API.ChangePassword, payload);
    if (response?.data) {
      // Check for data property
      yield put(changePasswordSuccess(response.data));
      success(i18n.t('Toast.PasswordChangeSuccessfull'));
    } else if (response?.errors) {
      console.log('Error response', response);

      yield put(changePasswordFail(response.errors));
    }
  } catch (error) {
    console.error('Updating password error', error);
    yield put(changePasswordFail(error.message));
  }
}

function* passwordSaga() {
  yield all([
    takeEvery(`${PASSWORD_CHANGE_REDUCER}/changePassword`, changePasswordSaga),
  ]);
}

export default passwordSaga;
