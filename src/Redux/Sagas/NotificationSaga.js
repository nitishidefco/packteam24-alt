import {all, call, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/SendNotificationTokenService';
import {NOTIFICATION_REDUCER} from '../SliceKey';
import {
  notificationFail,
  notificationSuccess,
} from '../Reducers/NotificationSlice';
import i18n from '../../i18n/i18n';

function* notificationSaga({payload}) {
  try {
    const response = yield call(API.SendToken, payload.payload);
    console.log('response from notification saga', response);

    if (response) {
      yield put(notificationSuccess(response?.message));
      return;
    } else if (response?.errors) {
      yield put(notificationFail(response.errors));
    }
  } catch (error) {
    console.error('Notification saga error:', {
      message: error.message,
      stack: error.stack,
      response: error.response ? error.response.data : 'No response data',
      config: error.config || 'No config data',
    });
    yield put(notificationFail(error));
  }
}

function* notificationSagaExport() {
  yield all([
    takeEvery(`${NOTIFICATION_REDUCER}/notification`, notificationSaga),
  ]);
}

export default notificationSagaExport;
