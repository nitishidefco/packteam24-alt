import {all, call, delay, put, take, takeEvery} from 'redux-saga/effects';

import {
  getCatsFailure,
  getCatsSuccess,
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
import ToastMessage, {success} from '../../Helpers/ToastMessage';
import {useTranslation} from 'react-i18next';

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
      const success = `${t(ResetPassword.passwordResetSuccess)}`;
      success(success); //Toast message
      yield put(forgotPasswordSuccess(response));
    } else {
      yield put(forgotPasswordFailure(response));
    }
  } catch (error) {
    yield put(forgotPasswordFailure(error));
  }
};

const createAccountSaga = function* createAccountSaga({payload}) {
  try {
    const response = yield call(API.CreateAccount, payload);
    if (response) {
      console.log('response message', response.message);
      // const success = `${t(ResetPassword.passwordResetSuccess)}`;
      success('Account Created Successfully'); //Toast message
      yield put(createAccountSuccess(response));
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
