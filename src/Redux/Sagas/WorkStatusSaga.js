import {all, call, delay, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/ScanServices';
import {WORKSTATE_REDUCER} from '../SliceKey';
import {
  FetchFailure,
  FetchSuccess,
} from '../Reducers/WorkStateSlice';

const fetchWorkStatusSaga = function* fetchWorkStatusSaga({payload}) {
  try {
    const response = yield call(API.WorkStatus, payload);
    if (response) {
      yield put(FetchSuccess(response));
    } else if (response?.errors) {
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