import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import MessageService from '../Services/MessageService';
import {ARCHIVE_REDUCER} from '../SliceKey';
import {
  fetchArchivedMessagesFailure,
  moveToMessagesSuccess,
  moveToMessagesFailure,
  fetchArchivedMessagesStart,
  deleteMessagesSuccess,
  deleteMessagesFailure,
  markAsUnread,
  fetchArchivedMessagesSuccess,
  multipleMarkMessagesFailure,
  multipleMarkMessagesSuccess,
  markAsRead,
  searchArchivedMessagesFailure,
  searchArchivedMessagesSuccess,
} from '../Reducers/ArchiveSlice';

import {} from '../Reducers/ArchiveSlice';
import {success} from '../../Helpers/ToastMessage';
import {fetchUnreadCountSuccess} from '../Reducers/MessageSlice';
import i18n from '../../i18n/i18n';

function* fetchArchivedMessagesSaga({payload}) {
  try {
    const response = yield call(
      MessageService.GetArchivedMessages,
      payload.payload,
    );

    if (response && response.message === 'OK') {
      yield put(
        fetchArchivedMessagesSuccess({
          messages: response.data.data,
          total: response.data.total,
          totalPages: response.data.last_page,
        }),
      );
    } else {
      yield put(
        fetchArchivedMessagesFailure(
          response?.errors || 'Failed to fetch archived messages',
        ),
      );
    }
  } catch (error) {
    yield put(
      fetchArchivedMessagesFailure(
        error.message || 'Failed to fetch archived messages',
      ),
    );
  }
}

function* searchArchivedMessagesSaga({payload}) {
  try {
    const response = yield call(MessageService.SearchKeyword, payload.payload);
    console.log('Seach response', response);

    if (response && response.message === 'OK') {
      yield put(
        searchArchivedMessagesSuccess({
          messages: response.data.data,
          keyword: payload.keyword,
        }),
      );
    } else {
      yield put(
        searchArchivedMessagesFailure(
          response?.errors || 'Failed to search archived messages',
        ),
      );
    }
  } catch (error) {
    yield put(
      searchArchivedMessagesFailure(
        error.message || 'Failed to search archived messages',
      ),
    );
  }
}

function* moveToMessagesSaga({payload}) {
  try {
    const response = yield call(
      MessageService.MultipleMarkAsRead,
      payload.payload,
    );
    if (response.success) {
      yield put(moveToMessagesSuccess(payload.messageIds));
      success(response.message);

      const state = yield select();
      const {currentPage} = state.Archive;
      const {deviceId} = state.Network;
      const authState = state.Auth;
      const sessionId = authState?.data?.data?.sesssion_id;
      const globalLanguage = state.GlobalLanguage?.globalLanguage || 'en';

      const formData = new FormData();
      formData.append('page', currentPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);

      const statusPart = payload.payload._parts?.find(
        part => part[0] === 'status',
      );
      if (statusPart) {
        formData.append('status', statusPart[1]);
      }
      const keywordPart = payload.payload._parts?.find(
        part => part[0] === 'keyword',
      );
      if (keywordPart) {
        formData.append('keyword', keywordPart[1]);
      }
      yield put(fetchArchivedMessagesStart({payload: formData}));
    } else {
      yield put(
        moveToMessagesFailure(response.errors || 'Failed to move to messages'),
      );
    }
  } catch (error) {
    yield put(
      moveToMessagesFailure(error.message || 'Failed to move to messages'),
    );
  }
}

function* deleteMessagesSaga({payload}) {
  console.log('delete payload', payload.payload);
  try {
    const response = yield call(
      MessageService.PermanentlyDelete,
      payload.payload,
    );
    console.log('delete response', response);

    if (response.success) {
      yield put(deleteMessagesSuccess(payload.messageIds));
      const successMessage = i18n.t('Toast.MessageDeletedSuccessfully');
      success(successMessage);
      const state = yield select();
      const {currentPage} = state.Archive;
      const {deviceId} = state.Network;
      const authState = state.Auth;
      const sessionId = authState?.data?.data?.sesssion_id;
      const globalLanguage = state.GlobalLanguage?.globalLanguage || 'en';

      const formData = new FormData();
      formData.append('page', currentPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);

      const statusPart = payload.payload._parts?.find(
        part => part[0] === 'status',
      );
      if (statusPart) {
        formData.append('status', statusPart[1]);
      }
      const keywordPart = payload.payload._parts?.find(
        part => part[0] === 'keyword',
      );
      if (keywordPart) {
        formData.append('keyword', keywordPart[1]);
      }
      yield put(fetchArchivedMessagesStart({payload: formData}));
    } else {
      yield put(
        deleteMessagesFailure(response.errors || 'Failed to delete messages'),
      );
    }
  } catch (error) {
    yield put(
      deleteMessagesFailure(error.message || 'Failed to delete messages'),
    );
  }
}

function* multipleMarkMessagesSaga({payload}) {
  try {
    const response = yield call(
      MessageService.MultipleMarkAsRead,
      payload.payload,
    );

    if (response.success) {
      success(response.message);
      yield put(
        multipleMarkMessagesSuccess({
          messageIds: payload.messageIds,
          read: payload.read,
        }),
      );

      const state = yield select();
      const {archivedMessages} = state.Archive;
      const unreadCount = archivedMessages.filter(msg => msg.read === 0).length;
      yield put(fetchUnreadCountSuccess(unreadCount));

      const {currentPage} = state.Archive;
      const {deviceId} = state.Network;
      const authState = state.Auth;
      const sessionId = authState?.data?.data?.sesssion_id;
      const globalLanguage = state.GlobalLanguage?.globalLanguage || 'en';

      const formData = new FormData();
      formData.append('page', currentPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);

      const statusPart = payload.payload._parts?.find(
        part => part[0] === 'status',
      );
      if (statusPart) {
        formData.append('status', statusPart[1]);
      }

      const keywordPart = payload.payload._parts?.find(
        part => part[0] === 'keyword',
      );
      if (keywordPart) {
        formData.append('keyword', keywordPart[1]);
      }

      console.log(
        '[ArchiveSaga] fetchArchivedMessagesStart called from multipleMarkMessagesSaga:',
        {
          page: currentPage,
          status: statusPart?.[1],
          keyword: keywordPart?.[1] || 'none',
        },
      );

      yield put(fetchArchivedMessagesStart({payload: formData}));
    } else {
      yield put(
        multipleMarkMessagesFailure(
          response.errors || 'Failed to mark messages',
        ),
      );
    }
  } catch (error) {
    yield put(
      multipleMarkMessagesFailure(error.message || 'Failed to mark messages'),
    );
  }
}

function* markAsReadSaga({payload}) {
  try {
    const response = yield call(
      MessageService.MultipleMarkAsRead,
      payload.payload,
    );
    if (response.success) {
      yield put(markAsRead(payload.messageId));
      const state = yield select();
      const {archivedMessages} = state.Archive;
      const unreadCount = archivedMessages.filter(msg => msg.read === 0).length;
      yield put(fetchUnreadCountSuccess(unreadCount));
      const {currentPage} = state.Archive;
      const {deviceId} = state.Network;
      const authState = state.Auth;
      const sessionId = authState?.data?.data?.sesssion_id;
      const globalLanguage = state.GlobalLanguage?.globalLanguage || 'en';

      const formData = new FormData();
      formData.append('page', currentPage.toString());
      formData.append('device_id', deviceId);
      formData.append('session_id', sessionId);
      formData.append('lang', globalLanguage);

      const statusPart = payload.payload._parts?.find(
        part => part[0] === 'status',
      );
      if (statusPart) {
        formData.append('status', statusPart[1]);
      }

      const keywordPart = payload.payload._parts?.find(
        part => part[0] === 'keyword',
      );
      if (keywordPart) {
        formData.append('keyword', keywordPart[1]);
      }
      yield put(fetchArchivedMessagesStart({payload: formData}));
    } else {
      yield put(
        fetchArchivedMessagesFailure(
          response.errors || 'Failed to mark as read',
        ),
      );
    }
  } catch (error) {
    yield put(
      fetchArchivedMessagesFailure(error.message || 'Failed to mark as read'),
    );
  }
}

function* markAsUnreadSaga({payload}) {
  try {
    const response = yield call(
      MessageService.MultipleMarkAsRead,
      payload.payload,
    );
    console.log('response of markasunread saga', response);

    if (response.success) {
      yield put(markAsUnread(payload.messageId));
      success(response.message);
    } else {
      yield put(
        fetchArchivedMessagesFailure(
          response.errors || 'Failed to mark as unread',
        ),
      );
    }
  } catch (error) {
    yield put(
      fetchArchivedMessagesFailure(error.message || 'Failed to mark as unread'),
    );
  }
}

export default function* archiveSaga() {
  yield all([
    takeEvery(
      `${ARCHIVE_REDUCER}/fetchArchivedMessagesStart`,
      fetchArchivedMessagesSaga,
    ),
    takeEvery(`${ARCHIVE_REDUCER}/moveToMessagesStart`, moveToMessagesSaga),
    takeEvery(`${ARCHIVE_REDUCER}/deleteMessagesStart`, deleteMessagesSaga),
    takeEvery(
      `${ARCHIVE_REDUCER}/multipleMarkMessages`,
      multipleMarkMessagesSaga,
    ),
    takeEvery(`${ARCHIVE_REDUCER}/markAsUnread`, markAsUnreadSaga),
    takeEvery(`${ARCHIVE_REDUCER}/markAsRead`, markAsReadSaga),
    takeEvery(
      `${ARCHIVE_REDUCER}/searchArchivedMessagesStart`,
      searchArchivedMessagesSaga,
    ),
  ]);
}
