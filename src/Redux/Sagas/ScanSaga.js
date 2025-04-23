import {all, call, put, takeEvery, delay} from 'redux-saga/effects';
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
import {AppState} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {clearOfflineStorage} from '../Reducers/SaveDataOfflineSlice';

// Worker Saga for scanning a tag
function* scanSaga({payload}) {
  try {
    const response = yield call(API.ScanTag, payload);
    console.log('response', response);

    if (response?.data) {
      yield put(ScanSuccess(response.data)); // Dispatch success action
      yield put({type: `${WORKSTATE_REDUCER}/fetchWorkStatus`, payload});
      yield put({type: `${WORK_HISTORY_REDUCER}/getWorkHistory`, payload});
    } else {
      yield put(ScanFailure(response?.errors || 'Scan failed'));
    }
  } catch (error) {
    console.log('errir of scan', error);

    // yield put(ScanFailure(error.message || 'Unexpected error'));
  }
}

// Worker Saga for bulk update
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

function* bulkUpdateSaga({payload}) {
  console.log('Bulk update payload:', payload);
  let retryCount = 0;
  let isAppInForeground = AppState.currentState === 'active';

  // Listen to App State Changes
  const handleAppStateChange = nextAppState => {
    isAppInForeground = nextAppState === 'active';
  };
  const subscription = AppState.addEventListener(
    'change',
    handleAppStateChange,
  );

  while (retryCount < MAX_RETRIES) {
    try {
      // Wait until the app is in the foreground
      if (!isAppInForeground) {
        console.log('App is in background. Waiting...');
        yield delay(RETRY_DELAY);
        continue;
      }

      // Check network status before making request
      const state = yield NetInfo.fetch();
      if (!state.isConnected) {
        console.log('No internet connection. Retrying...');
        yield delay(RETRY_DELAY);
        retryCount++;
        continue;
      }

      // Call the BulkUpdate API and get the response
      const response = yield call(API.BulkUpdate, payload);
      console.log('Bulk update response:', response);

      if (response?.success) {
        // If successful, dispatch the success action with the data
        yield put(SendSuccess(response.data));
        yield put({type: `${WORKSTATE_REDUCER}/fetchWorkStatus`, payload});
        yield put({type: `${WORK_HISTORY_REDUCER}/getWorkHistory`, payload});
        yield put(clearOfflineStorage());
        subscription.remove();
        return;
      } else {
        console.error(
          'Bulk update failed:',
          response.errors || response.message,
        );
        yield put(
          SendFailure(
            response.errors || response.message || 'Bulk update failed',
          ),
        );
        subscription.remove();
        return;
      }
    } catch (error) {
      console.error('Bulk update error:', error);

      if (retryCount < MAX_RETRIES - 1) {
        console.log(`Retrying request... Attempt ${retryCount + 1}`);
        yield delay(RETRY_DELAY);
        retryCount++;
      } else {
        yield put(SendFailure('Network request failed after retries'));
        subscription.remove();
        return;
      }
    }
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
