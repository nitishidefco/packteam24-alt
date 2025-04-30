// src/Redux/Sagas/MessageSaga.js
import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import MessageService from '../Services/MessageService';
import {MESSAGE_REUCER} from '../SliceKey';
import {
  fetchMessagesSuccess,
  fetchMessagesFailure,
  fetchUnreadCountSuccess,
  fetchUnreadCountFailure,
  fetchMessagesStart,
  moveToArchiveSuccess,
  moveToArchiveFailure,
  multipleMarkMessagesSuccess,
  multipleMarkMessagesFailure,
  searchMessagesFailure,
  searchMessagesSuccess,
} from '../Reducers/MessageSlice';
import {success} from '../../Helpers/ToastMessage';

function* fetchMessagesSaga({payload}) {
  console.log('Payload message saga', payload.payload);

  try {
    const response = yield call(
      MessageService.GetNotifications,
      payload.payload,
    );

    if (response) {
      yield put(
        fetchMessagesSuccess({
          messages: response?.data?.data,
          total: response?.data?.total,
          totalPages: response?.data?.last_page,
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
      yield put(fetchMessagesStart({payload: payload.payload}));
      return;
    } else if (response?.errors) {
      yield put(fetchUnreadCountFailure(response.errors));
    }
  } catch (error) {
    console.error('Fetching unread count error', error);
    yield put(
      fetchUnreadCountFailure(
        error,
        error.message || 'Failed to fetch unread count',
      ),
    );
  }
}

function* markAsReadSaga({payload}) {
  try {
    const response = yield call(MessageService.MarkAsRead, payload.payload);
    if (response.success) {
      const state = yield select();
      const {currentPage} = state.Messages;
      const {deviceId} = state.Network;
      const authState = state.Auth;
      const sessionId = authState?.data?.data?.sesssion_id;
      const globalLanguage = state.GlobalLanguage?.globalLanguage || 'en';

      const formData = new FormData();
      formData.append('page', currentPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);

      // Dispatch fetchMessagesStart to refetch messages
      yield put(fetchMessagesStart({payload: formData}));
    }
  } catch (error) {
    yield put(fetchMessagesFailure(error.message));
  }
}

function* searchMessagesSaga({payload}) {
  try {
    const response = yield call(MessageService.SearchKeyword, payload.payload);

    if (response && response.message === 'OK') {
      yield put(
        searchMessagesSuccess({
          messages: response.data.data,
          keyword: payload.keyword,
        }),
      );
    } else {
      yield put(
        searchMessagesFailure(response?.errors || 'Failed to search messages'),
      );
    }
  } catch (error) {
    yield put(
      searchMessagesFailure(error.message || 'Failed to search messages'),
    );
  }
}

function* moveToArchiveSaga({payload}) {
  try {
    const response = yield call(MessageService.MoveToArchives, payload.payload);
    console.log('Move to archive response', response);

    if (response.success) {
      success('Messaged Archived Successfully');
      const state = yield select();
      const {currentPage, selectedMessages} = state.Messages;
      console.log('Selected Messages', selectedMessages);
      yield put(moveToArchiveSuccess(selectedMessages.join(', ')));

      const {deviceId} = state.Network;
      const authState = state.Auth;
      const sessionId = authState?.data?.data?.sesssion_id;
      const globalLanguage = state.GlobalLanguage?.globalLanguage || 'en';

      const formData = new FormData();
      formData.append('page', currentPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);

      yield put(fetchMessagesStart({payload: formData}));
    } else {
      yield put(
        moveToArchiveFailure(response.errors || 'Failed to move to archive'),
      );
    }
  } catch (error) {
    console.error('Move to archive error', error);
    yield put(
      moveToArchiveFailure(error.message || 'Failed to move to archive'),
    );
  }
}
function* multipleMarkMessagesSaga({payload}) {
  try {
    const response = yield call(
      MessageService.MultipleMarkAsRead,
      payload.payload,
    );
    console.log('Multiple mark messages response', response);

    if (response.success) {
      yield put(
        multipleMarkMessagesSuccess({
          messageIds: payload.messageIds,
          read: payload.read,
        }),
      );

      const state = yield select();
      const {currentPage} = state.Messages;
      const {deviceId} = state.Network;
      const authState = state.Auth;
      const sessionId = authState?.data?.data?.sesssion_id;
      const globalLanguage = state.GlobalLanguage?.globalLanguage || 'en';

      const formData = new FormData();
      formData.append('page', currentPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);

      yield put(fetchMessagesStart({payload: formData}));
    } else {
      yield put(
        multipleMarkMessagesFailure(
          response.errors || 'Failed to mark messages',
        ),
      );
    }
  } catch (error) {
    console.error('Multiple mark messages error', error);
    yield put(
      multipleMarkMessagesFailure(error.message || 'Failed to mark messages'),
    );
  }
}
export default function* messageSaga() {
  yield all([
    takeEvery(`${MESSAGE_REUCER}/fetchMessagesStart`, fetchMessagesSaga),
    takeEvery(`${MESSAGE_REUCER}/fetchUnreadCountStart`, fetchUnreadCountSaga),
    takeEvery(`${MESSAGE_REUCER}/markAsRead`, markAsReadSaga),
    takeEvery(`${MESSAGE_REUCER}/moveToArchiveStart`, moveToArchiveSaga),
    takeEvery(
      `${MESSAGE_REUCER}/multipleMarkMessages`,
      multipleMarkMessagesSaga,
    ),
    takeEvery(`${MESSAGE_REUCER}/searchMessagesStart`, searchMessagesSaga),
  ]);
}
