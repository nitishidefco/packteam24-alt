import {all, call, delay, put, takeEvery} from 'redux-saga/effects';

import {
  getCatsFailure,
  getCatsSuccess,
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutSuccess,
} from '../Reducers/AuthSlice';
import API from '../Services/AuthServices';
import {AUTH_REDUCER} from '../SliceKey';
import {reduxStorage} from '../Storage/index';
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
      yield put(logoutSuccess(response));
      reduxStorage.removeItem('token');
    } else {
      yield put(logoutFailure(response));
    }
  } catch (error) {
    yield put(logoutFailure(error));
  }
};

function* authSaga() {
  yield all([yield takeEvery(`${AUTH_REDUCER}/getLogin`, loginSaga)]);
  yield all([yield takeEvery(`${AUTH_REDUCER}/getLogout`, logoutSaga)]);
}

export default authSaga;
