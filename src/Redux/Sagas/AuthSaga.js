import {all, call, delay, put, take, takeEvery} from 'redux-saga/effects';

import {
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutSuccess,
  forgotPasswordFailure,
  forgotPasswordSuccess,
  createAccountSuccess,
  createAccountFailure,
} from '../Reducers/AuthSlice';
import API from '../Services/AuthServices';
import {AUTH_REDUCER} from '../SliceKey';
import {reduxStorage} from '../Storage/index';
import {success} from '../../Helpers/ToastMessage';
import i18n from '../../i18n/i18n';

const loginSaga = function* loginSaga({payload}) {
  try {
    const response = yield call(API.Login, payload);
    console.log('after login response', response?.data);
    if (response?.data?.sesssion_id && response?.message == 'OK') {
      reduxStorage.setItem('token', response?.data?.sesssion_id);
      yield put(loginSuccess(response));
    } else {
      yield put(loginFailure(response));
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
};

const logoutSaga = function* logoutSaga({payload}) {
  try {
    const response = yield call(API.Logout, payload);
    if (response) {
      console.log(response);

      yield put(logoutSuccess(response));
      reduxStorage.removeItem('token');
    } else {
      yield put(logoutFailure(response));
    }
  } catch (error) {
    yield put(logoutFailure(error));
  }
};

const forgotPasswordSaga = function* forgotPasswordSaga({payload}) {
  try {
    const response = yield call(API.ForgotPassword, payload);
    if (response) {
      console.log('response message', response.message);
      success(i18n.t('ResetPassword.passwordResetSuccess')); //Toast message
      yield put(forgotPasswordSuccess(response));
    } else {
      yield put(forgotPasswordFailure(response));
    }
  } catch (error) {
    yield put(forgotPasswordFailure(error));
  }
};

const createAccountSaga = function* createAccountSaga({payload}) {
  console.log(payload.navigation);

  try {
    const response = yield call(API.CreateAccount, payload.payload);
    if (response) {
      console.log('response message', response.message);
      // const success = `${t(ResetPassword.passwordResetSuccess)}`;
      success(i18n.t('Toast.AccountCreatedSuccessfull')); //Toast message
      yield put(createAccountSuccess(response));
      payload.navigation.navigate('Login');
    } else {
      yield put(createAccountFailure(response));
    }
  } catch (error) {
    yield put(createAccountFailure(error));
  }
};

function* authSaga() {
  yield all([yield takeEvery(`${AUTH_REDUCER}/getLogin`, loginSaga)]);
  yield all([yield takeEvery(`${AUTH_REDUCER}/getLogout`, logoutSaga)]);
  yield all([
    yield takeEvery(`${AUTH_REDUCER}/getForgotPassword`, forgotPasswordSaga),
  ]);
  yield all([
    yield takeEvery(`${AUTH_REDUCER}/createAccount`, createAccountSaga),
  ]);
}

export default authSaga;
