import {all, call, put, takeEvery} from 'redux-saga/effects';
import API from '../Services/SendNotificationTokenService';
import {NOTIFICATION_REDUCER} from '../SliceKey';
import {errorToast, success} from '../../Helpers/ToastMessage';
import i18n from '../../i18n/i18n';
import { notificationFail, notificationSuccess } from '../Reducers/NotificationSlice';

function* notificationSaga({payload}) {
  try {
    const response = yield call(API.SendToken, payload.payload);
    console.log('notification response', response);

    if (response?.data) {
      yield put(notificationSuccess(response.data));
    } else if (response?.errors) {
      console.log(response);

      yield put(notificationFail(response.errors));
    }
  } catch (error) {
    console.error('Updating password error', error.errors);
    yield put(notificationFail(error.errors.current_password));
    errorToast(error?.errors?.current_password);
  }
}

function* notificationSagaExport() {
  yield all([
    takeEvery(`${NOTIFICATION_REDUCER}/notification`, notificationSaga),
  ]);
}

export default notificationSagaExport;
