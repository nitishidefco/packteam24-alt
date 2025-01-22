import {all, call, put, takeEvery} from 'redux-saga/effects';

import API from '../Services/WorkHistoryService';
import {WORK_HISTORY_REDUCER} from '../SliceKey';
import {
  FetchWorkHistoryFailure,
  FetchWorkHistorySuccess,
} from '../Reducers/WorkHistorySlice';

const fetchWorkHistorySaga = function* fetchWorkHistorySaga({payload}) {
  try {
    const response = yield call(API.WorkHistory, payload);

    if (response) {

      yield put(FetchWorkHistorySuccess(response));
    } else if (response?.errors) {
      yield put(FetchWorkHistoryFailure(response?.errors));
    }
  } catch (error) {
    console.error('Fetch work history error', error);
  }
};

function* fetchWorkHistoryFromServer() {
  yield all([
    yield takeEvery(
      `${WORK_HISTORY_REDUCER}/getWorkHistory`,
      fetchWorkHistorySaga,
    ),
  ]);
}

export default fetchWorkHistoryFromServer;
