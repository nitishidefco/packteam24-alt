import {all, call, delay, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/ScanServices';
import {WORKSTATE_REDUCER} from '../SliceKey';
import {
  FetchFailure,
  FetchSuccess,
  fetchWorkStatus,
} from '../Reducers/WorkStateSlice';

const fetchWorkStatusSaga = function* fetchWorkStatusSaga({payload}) {
  try {
    const response = yield call(API.WorkStatus, payload);
    console.log('Fetch work status response', response);

    if (response) {
      yield put(FetchSuccess(response));
      console.log('Fetch work status response success', response);
    } else if (response?.errors) {
      console.log('Fetch work status response error', response);
      yield put(FetchFailure(response?.errors));
    }
  } catch (error) {
    console.error('Fetch work status error', error);
  }
};

function* fetchWorkStatusFromServerSaga() {
  yield all([
    yield takeEvery(
      `${WORKSTATE_REDUCER}/fetchWorkStatus`,
      fetchWorkStatusSaga,
    ),
  ]);
}

export default fetchWorkStatusFromServerSaga;