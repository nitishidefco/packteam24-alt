import {all, call, delay, put, takeEvery} from 'redux-saga/effects';

import {
  getScan,
  ScanSlice,
  ScanFailure,
  ScanSuccess,
} from '../Reducers/ScanSlice';

import API from '../Services/ScanServices';

import {SCAN_REDUCER} from '../SliceKey';
import {Alert} from 'react-native';

const scanSaga = function* scanSaga({payload}) {
  // console.log('scansagapaykliad', payload);

  try {
    const response = yield call(API.ScanTag, payload);
    console.log('scan saga response', response);

    if (response?.data) {
      yield put(ScanSuccess(response));
    } else {
      console.log('response error', response);

      yield put(ScanFailure(response?.errors));
    }
  } catch (error) {
    console.log('scan saga', error);

    yield put(ScanFailure(error));
  }
};

function* scanTagSaga() {
  yield all([yield takeEvery(`${SCAN_REDUCER}/getScan`, scanSaga)]);
}

export default scanTagSaga;
