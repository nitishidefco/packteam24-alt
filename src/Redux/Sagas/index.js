import {all} from 'redux-saga/effects';
import authSaga from './AuthSaga';
import homeSaga from './HomeSaga';
import dailyListSaga from './DailyListSaga';
import scanTagSaga from './ScanSaga';
//Main Root Saga
const rootSaga = function* rootSaga() {
  yield all([authSaga(), homeSaga(), dailyListSaga(), scanTagSaga()]);
};
export default rootSaga;
