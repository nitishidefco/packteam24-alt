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
import {errorToast, success} from '../../Helpers/ToastMessage';
import i18n from '../../i18n/i18n';
import ElapsedTime from '../../../spec/NativeElapsedTime';
const loginSaga = function* loginSaga({payload}) {
  try {
    const response = yield call(API.Login, payload);

    if (response?.data?.sesssion_id && response?.message == 'OK') {
      const elapsedTimeMs = yield call([
        ElapsedTime,
        ElapsedTime.getElapsedTime,
      ]);
      yield call(reduxStorage.setItem, 'token', response?.data?.sesssion_id);
      yield call(
        reduxStorage.setItem,
        'trueTime',
        response?.data?.current_time,
      );
      yield call(
        reduxStorage.setItem,
        'trueDate',
        response?.data?.current_date,
      );
      yield call(
        reduxStorage.setItem,
        'realTimeDiffAtLogin',
        elapsedTimeMs.toString(),
      );
     
      yield put(loginSuccess(response));
    } else {
      yield put(loginFailure(response));
      errorToast(response?.errors?.password);
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
};

const logoutSaga = function* logoutSaga({payload}) {
  try {
    const response = yield call(API.Logout, payload.payload);

    if (response) {
      yield put(logoutSuccess(response));
      reduxStorage.removeItem('token');
      payload.navigation.navigate('Login');
    } else {
      yield put(logoutFailure(response));
      // payload.navigation.navigate('Login');
    }
  } catch (error) {
    yield put(logoutFailure(error));
  }
};

const forgotPasswordSaga = function* forgotPasswordSaga({payload}) {
  try {
    const response = yield call(API.ForgotPassword, payload);
    if (!response?.errors?.email) {
      console.log('forgot password response', response);

      yield put(forgotPasswordSuccess(response));
      success(response?.message);
    } else {
      errorToast(response?.errors?.email);
      yield put(forgotPasswordFailure(response));
    }
  } catch (error) {
    yield put(forgotPasswordFailure(error));
  }
};

const createAccountSaga = function* createAccountSaga({payload}) {
  try {
    const response = yield call(API.CreateAccount, payload.payload);
    if (response.message === 'OK') {
      // const success = `${t(ResetPassword.passwordResetSuccess)}`;
      success(
        i18n.t('Toast.AccountCreatedSuccessfull'),
        i18n.t('Toast.AccountCreatedSuccessfullSubtitle'),
      );

      yield put(createAccountSuccess(response));
      payload.navigation.navigate('Login');
    } else if (response.errors.email) {
      errorToast(response.errors.email);
      yield put(createAccountFailure(response));
    } else if (response.errors.password) {
      errorToast(response.errors.password);
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
