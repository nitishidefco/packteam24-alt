import {all, call, put, takeEvery} from 'redux-saga/effects';
import {
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

// Worker Saga for scanning a tag
function* scanSaga({payload}) {
  try {
    const response = yield call(API.ScanTag, payload);
    if (response?.data) {
      yield put(ScanSuccess(response.data)); // Dispatch success action
      yield put({type: `${WORKSTATE_REDUCER}/fetchWorkStatus`, payload});
      yield put({type: `${WORK_HISTORY_REDUCER}/getWorkHistory`, payload});
    } else {
      yield put(ScanFailure(response?.errors || 'Scan failed'));
    }
  } catch (error) {
    yield put(ScanFailure(error.message || 'Unexpected error'));
  }
}

// Worker Saga for bulk update
function* bulkUpdateSaga({payload}) {
  console.log('Bulk update payload:', payload);

  try {
    // Call the BulkUpdate API and get the response
    const response = yield call(API.BulkUpdate, payload);
    console.log('Bulk update response:', response);

    // Check if the response indicates success or failure
    if (response?.success) {
      // If successful, dispatch the success action with the data
      yield put(SendSuccess(response.data));
      yield put({type: `${WORKSTATE_REDUCER}/fetchWorkStatus`, payload});
      yield put({type: `${WORK_HISTORY_REDUCER}/getWorkHistory`, payload});
    } else {
      // If failed, dispatch the failure action with errors
      yield put(
        SendFailure(
          response.errors || response.message || 'Bulk update failed',
        ),
      );
    }
  } catch (error) {
    console.error('Bulk update error:', error);
    yield put(SendFailure(error.message || 'Unexpected error'));
  }
}

// Watcher Saga: Watches for actions dispatched to the store
function* watchScanSaga() {
  yield takeEvery(`${SCAN_REDUCER}/getScan`, scanSaga);
}

function* watchBulkUpdateSaga() {
  yield takeEvery(`${SCAN_REDUCER}/sendBulk`, bulkUpdateSaga);
}

// Root saga that combines all watchers
export default function* scanTagSaga() {
  yield all([watchScanSaga(), watchBulkUpdateSaga()]);
}
