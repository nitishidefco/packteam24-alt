import {all, call, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/SendNotificationTokenService';
import {NOTIFICATION_REDUCER} from '../SliceKey';
import {
  notificationFail,
  notificationSuccess,
} from '../Reducers/NotificationSlice';

function* notificationSaga({payload}) {
  try {
    const response = yield call(API.SendToken, payload.payload);

    if (response) {
      yield put(notificationSuccess(response?.message));
      return;
    } else if (response?.errors) {
      yield put(notificationFail(response.errors));
    }
  } catch (error) {
    console.error('Updating password error', error.errors);
    yield put(notificationFail(error.errors.current_password));
  }
}

function* notificationSagaExport() {
  yield all([
    takeEvery(`${NOTIFICATION_REDUCER}/notification`, notificationSaga),
  ]);
}

export default notificationSagaExport;
