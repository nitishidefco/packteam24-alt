import {all} from 'redux-saga/effects';
import authSaga from './AuthSaga';
import homeSaga from './HomeSaga';
import dailyListSaga from './DailyListSaga';
import scanTagSaga from './ScanSaga';
import fetchNfcTagFromServerSaga from './StoreNfcTagsSaga';
import fetchWorkStatusFromServerSaga from './WorkStatusSaga';
import userProfileSaga from './UserProfileSaga';
import passwordSaga from './ChangePasswordSaga';
import fetchWorkHistoryFromServer from './WorkHistorySaga';
import notificationSagaExport from './NotificationSaga';
import messageSaga from './MessagesSaga';
import archiveSaga from './ArchiveSaga';

//Main Root Saga
const rootSaga = function* rootSaga() {
  yield all([
    authSaga(),
    homeSaga(),
    dailyListSaga(),
    scanTagSaga(),
    fetchNfcTagFromServerSaga(),
    fetchWorkStatusFromServerSaga(),
    userProfileSaga(),
    passwordSaga(),
    fetchWorkHistoryFromServer(),
    notificationSagaExport(),
    messageSaga(),
    archiveSaga(),
  ]);
};
export default rootSaga;
