import {all, call, put, takeEvery} from 'redux-saga/effects';

import API from '../Services/WorkHistoryService';

//!! Work History also has now real time from server apis

import {WORK_HISTORY_REDUCER} from '../SliceKey';
import {
  FetchWorkHistoryFailure,
  FetchWorkHistorySuccess,
  GetRealTimeFailure,
  GetRealTimeSuccess,
} from '../Reducers/WorkHistorySlice';
import reactotron from '../../../ReactotronConfig';

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
function* fetchRealTimeSaga({payload}) {
  try {
    const response = yield call(API.GetRealTimeFromServer, payload);
    yield put(GetRealTimeSuccess(response));
  } catch (error) {
    yield put(GetRealTimeFailure(error.message));
  }
}
function* fetchWorkHistoryFromServer() {
  yield all([
    takeEvery(`${WORK_HISTORY_REDUCER}/getWorkHistory`, fetchWorkHistorySaga),
    takeEvery(`${WORK_HISTORY_REDUCER}/getRealTime`, fetchRealTimeSaga),
  ]);
}

export default fetchWorkHistoryFromServer;
