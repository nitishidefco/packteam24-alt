import {all, call, delay, put, takeEvery} from 'redux-saga/effects';

import {
  getScan,
  ScanSlice,
  ScanFailure,
  ScanSuccess,
  SendSuccess,
  SendFailure,
} from '../Reducers/ScanSlice';

import API from '../Services/ScanServices';
import {
  SCAN_REDUCER,
  WORKSTATE_REDUCER,
  WORK_HISTORY_REDUCER,
} from '../SliceKey';

const scanSaga = function* scanSaga({payload}) {
  try {
    const response = yield call(API.ScanTag, payload);
    if (response?.data) {
      yield put(ScanSuccess(response));
      yield put({
        type: `${WORKSTATE_REDUCER}/fetchWorkStatus`,
        payload: payload,
      });
      yield put({
        type: `${WORK_HISTORY_REDUCER}/getWorkHistory`,
        payload: payload,
      });
    } else {
      yield put(ScanFailure(response?.errors));
    }
  } catch (error) {
    yield put(ScanFailure(error));
  }
};

function* bulkUpdate({payload}) {
  try {
    const response = yield call(API.BulkUpdate, payload);
    console.log('fetch user profile rsponse', response);
    if (response?.data) {
      // Check for data property
      yield put(SendSuccess(response.data));
    } else if (response?.errors) {
      yield put(SendFailure(response.errors));
    }
  } catch (error) {
    console.error('Updating bulk history error', error);
    yield put(SendFailure(error.message));
  }
}

function* scanTagSaga() {
  yield all([yield takeEvery(`${SCAN_REDUCER}/getScan`, scanSaga)]);
}

export default scanTagSaga;
