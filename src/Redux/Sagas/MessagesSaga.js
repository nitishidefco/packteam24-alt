// src/Redux/Sagas/MessageSaga.js
import {all, call, put, takeEvery} from 'redux-saga/effects';
import MessageService from '../Services/MessageService';
import {MESSAGE_REUCER} from '../SliceKey';
import {
  fetchMessagesSuccess,
  fetchMessagesFailure,
  fetchUnreadCountSuccess,
  fetchUnreadCountFailure,
} from '../Reducers/MessageSlice';

function* fetchMessagesSaga({payload}) {
  console.log('Payload', payload);

  try {
    const response = yield call(
      MessageService.GetNotifications,
      payload.payload,
    );

    if (response) {
      yield put(
        fetchMessagesSuccess({
          messages: response.data.data,
          total: response.data.total,
          totalPages: response.data.last_page,
        }),
      );
      return;
    } else if (response?.errors) {
      yield put(fetchMessagesFailure(response.errors));
    }
  } catch (error) {
    console.error('Fetching messages error', error);
    yield put(
      fetchMessagesFailure(error.message || 'Failed to fetch messages'),
    );
  }
}

function* fetchUnreadCountSaga({payload}) {
  try {
    const response = yield call(MessageService.GetUnreadCount, payload.payload);
    console.log('fetchUnreadCount response', response);

    if (response) {
      yield put(fetchUnreadCountSuccess(response.data.count));
      return;
    } else if (response?.errors) {
      yield put(fetchUnreadCountFailure(response.errors));
    }
  } catch (error) {
    console.error('Fetching unread count error', error);
    yield put(
      fetchUnreadCountFailure(error.message || 'Failed to fetch unread count'),
    );
  }
}

export default function* messageSaga() {
  yield all([
    takeEvery(`${MESSAGE_REUCER}/fetchMessagesStart`, fetchMessagesSaga),
    takeEvery(`${MESSAGE_REUCER}/fetchUnreadCountStart`, fetchUnreadCountSaga),
  ]);
}
